/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useEffect, useMemo } from 'react';

import type { PostHog, PostHogConfig, PostHogInterface } from 'posthog-js';
import posthogJs from 'posthog-js';
import { PostHogProvider, usePostHog } from 'posthog-js/react';

import { TrackerPageView } from './page-view';
import { identifyCurrentUser, isLocalHost } from './tracker';
import { useAccountStore } from '../store/account';
import { useIsCarbonioCE } from '../store/login/hooks';
import { useLoginConfigStore } from '../store/login/store';
import type { AccountState } from '../types/account';

const sendAnalyticsSelector = (state: AccountState): boolean =>
	state.settings.prefs.carbonioPrefSendAnalytics === 'TRUE';

const isTrackerEnabled = (): boolean => sendAnalyticsSelector(useAccountStore.getState());

// single source of truth for the consent → posthog state mapping, shared by the
// loaded callback (async init path) and the TrackerSetup effects (pref-change path)
const applyConsentState = (postHog: PostHogInterface, sendAnalytics: boolean): void => {
	if (isLocalHost()) {
		return;
	}
	if (sendAnalytics) {
		postHog.opt_in_capturing();
		identifyCurrentUser(postHog);
	} else {
		postHog.opt_out_capturing();
	}
};

const applyCarbonioCEConfig = (
	// the loaded callback receives a PostHogInterface, which omits config:
	// without it the diff check degrades to an unconditional set_config
	postHog: PostHogInterface & Partial<Pick<PostHog, 'config'>>,
	isCarbonioCE: boolean | undefined
): void => {
	if (isCarbonioCE === undefined) {
		return;
	}
	postHog.setPersonProperties({ is_ce: isCarbonioCE });
	const disableSurveys = !isCarbonioCE;
	if (postHog.config?.disable_surveys !== disableSurveys) {
		postHog.set_config({ disable_surveys: disableSurveys });
	}
};

const TrackerSetup = (): null => {
	const postHog = usePostHog();
	const isCarbonioCE = useIsCarbonioCE();
	const sendAnalytics = useAccountStore(sendAnalyticsSelector);

	useEffect(() => {
		if (!postHog.__loaded) {
			return undefined;
		}
		applyConsentState(postHog, sendAnalytics);
		return () => {
			postHog.opt_out_capturing();
		};
	}, [postHog, sendAnalytics]);

	useEffect(() => {
		if (!postHog.__loaded || !sendAnalytics) {
			return;
		}
		applyCarbonioCEConfig(postHog, isCarbonioCE);
	}, [isCarbonioCE, postHog, sendAnalytics]);

	return null;
};

export const TrackerProvider = ({
	children
}: React.PropsWithChildren<Record<never, never>>): React.JSX.Element => {
	const sendAnalytics = useAccountStore(sendAnalyticsSelector);

	const options = useMemo(
		(): Partial<PostHogConfig> => ({
			api_host: POSTHOG_API_HOST || 'https://stats.zextras.tools',
			person_profiles: 'identified_only',
			opt_out_capturing_by_default: true,
			disable_session_recording: true,
			mask_all_text: true,
			disable_surveys: true,
			capture_pageview: false,
			capture_pageleave: true,
			autocapture: false,
			loaded: (postHog): void => {
				// init is requested only on consent, but the pref may have been
				// switched off again while posthog was still loading
				if (!isTrackerEnabled()) {
					return;
				}
				applyConsentState(postHog, true);
				applyCarbonioCEConfig(postHog, useLoginConfigStore.getState().isCarbonioCE);
			}
		}),
		[]
	);

	useEffect(() => {
		// deferred init: posthog stays completely inert (no cookies, no requests)
		// for users who did not opt into analytics. The provider is always mounted
		// to keep the tree shape stable: a conditional wrapper would remount the
		// whole app when the settings arrive after login
		if (sendAnalytics && !posthogJs.__loaded) {
			posthogJs.init(POSTHOG_API_KEY, options);
		}
	}, [sendAnalytics, options]);

	return (
		<PostHogProvider client={posthogJs}>
			<TrackerSetup />
			{children}
			<TrackerPageView />
		</PostHogProvider>
	);
};
