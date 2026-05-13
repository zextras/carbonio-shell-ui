/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useEffect, useMemo } from 'react';

import type { PostHogConfig } from 'posthog-js';
import { PostHogProvider, usePostHog } from 'posthog-js/react';

import { TrackerPageView } from './page-view';
import { identifyCurrentUser, isLocalHost } from './tracker';
import { useAccountStore } from '../store/account';
import { useIsCarbonioCE } from '../store/login/hooks';
import { useLoginConfigStore } from '../store/login/store';

const TrackerSetup = (): null => {
	const postHog = usePostHog();
	const isCarbonioCE = useIsCarbonioCE();

	useEffect(() => {
		if (postHog.__loaded && !isLocalHost()) {
			postHog.opt_in_capturing();
		}
		return () => {
			postHog.opt_out_capturing();
		};
	}, [postHog]);

	useEffect(() => {
		if (!postHog.__loaded || isCarbonioCE === undefined) {
			return;
		}
		postHog.setPersonProperties({ is_ce: isCarbonioCE });
		const newValue = !isCarbonioCE;
		if (postHog.config.disable_surveys !== newValue) {
			postHog.set_config({ disable_surveys: newValue });
		}
	}, [isCarbonioCE, postHog]);

	return null;
};

export const TrackerProvider = ({
	children
}: React.PropsWithChildren<Record<never, never>>): React.JSX.Element => {
	const carbonioPrefSendAnalytics = useAccountStore(
		(state) => state.settings.prefs.carbonioPrefSendAnalytics
	);

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
				if (!isLocalHost()) {
					postHog.opt_in_capturing();
				}
				identifyCurrentUser(postHog);
				const { isCarbonioCE } = useLoginConfigStore.getState();
				if (isCarbonioCE !== undefined) {
					postHog.setPersonProperties({ is_ce: isCarbonioCE });
					postHog.set_config({ disable_surveys: !isCarbonioCE });
				}
			}
		}),
		[]
	);

	if (carbonioPrefSendAnalytics !== 'TRUE') {
		return <>{children}</>;
	}

	return (
		<PostHogProvider apiKey={POSTHOG_API_KEY} options={options}>
			<TrackerSetup />
			{children}
			<TrackerPageView />
		</PostHogProvider>
	);
};
