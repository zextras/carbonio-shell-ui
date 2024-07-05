/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useCallback, useMemo } from 'react';

import type { PostHogConfig } from 'posthog-js';
import { PostHogProvider, usePostHog } from 'posthog-js/react';

import { useIsCarbonioCE } from '../store/login/hooks';
import { getCurrentLocationHost } from '../utils/utils';

export const TrackerProvider = ({
	children
}: React.PropsWithChildren<Record<never, never>>): React.JSX.Element => {
	const options = useMemo(
		(): Partial<PostHogConfig> => ({
			api_host: 'https://stats.zextras.tools',
			person_profiles: 'identified_only',
			opt_out_capturing_by_default: true,
			disable_session_recording: true,
			disable_surveys: true
		}),
		[]
	);
	return (
		<PostHogProvider apiKey={'phc_NjMdbTSzxs20hL6rnKY6KpfHtcVFRzeVEik6SmgtJQM'} options={options}>
			{children}
		</PostHogProvider>
	);
};

interface Tracker {
	enableTracker: (enable: boolean) => void;
	reset: () => void;
}

export const useTracker = (): Tracker => {
	const postHog = usePostHog();
	const isCarbonioCE = useIsCarbonioCE();

	const enableTracker = useCallback(
		(enable: boolean) => {
			if (
				!getCurrentLocationHost().includes('127.0.0.1') &&
				!getCurrentLocationHost().includes('localhost')
			) {
				if (enable) {
					if (isCarbonioCE) {
						postHog.set_config({ disable_surveys: false });
					}
					postHog.opt_in_capturing();
				} else {
					postHog.opt_out_capturing();
				}
			}
		},
		[isCarbonioCE, postHog]
	);

	const reset = useCallback(() => {
		postHog.reset();
	}, [postHog]);

	return { enableTracker, reset };
};
