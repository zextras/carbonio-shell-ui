/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useMemo } from 'react';

import type { PostHogConfig } from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

import { TrackerPageView } from './page-view';

export const TrackerProvider = ({
	children
}: React.PropsWithChildren<Record<never, never>>): React.JSX.Element => {
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
			debug: true
		}),
		[]
	);
	return (
		<PostHogProvider apiKey={POSTHOG_API_KEY} options={options}>
			{children}
			<TrackerPageView />
		</PostHogProvider>
	);
};
