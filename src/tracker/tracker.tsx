/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useCallback } from 'react';

import type { CaptureOptions, PostHogInterface, Properties } from 'posthog-js';
import { usePostHog } from 'posthog-js/react';

import { useAccountStore } from '../store/account';
import { getCurrentLocationHost } from '../utils/utils';

export interface Tracker {
	enableTracker: (enable: boolean) => void;
	reset: () => void;
	capture: (
		event_name: string,
		properties?: Properties | null | undefined,
		options?: CaptureOptions | undefined
	) => void;
}

const hashToSHA256 = async (value: string): Promise<ArrayBuffer> => {
	const encoder = new TextEncoder();
	const data = encoder.encode(value);
	return window.crypto.subtle.digest('SHA-256', data);
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
	const bytes = new Uint8Array(buffer);
	const binary = bytes.reduce((res, byte) => res + String.fromCharCode(byte), '');
	return window.btoa(binary);
};

export const isLocalHost = (): boolean => {
	const host = getCurrentLocationHost();
	return host.includes('127.0.0.1') || host.includes('localhost');
};

export const identifyCurrentUser = (postHog: PostHogInterface): void => {
	if (isLocalHost()) {
		return;
	}
	const { account } = useAccountStore.getState();
	if (account?.id) {
		hashToSHA256(account.id).then((arrayBuffer) => {
			const hashUserId = arrayBufferToBase64(arrayBuffer);
			postHog.identify(hashUserId);
		});
	}
};

export const useTracker = (): Tracker => {
	const postHog = usePostHog();

	const enableTracker = useCallback(
		(enable: boolean) => {
			if (isLocalHost()) {
				return;
			}
			if (enable) {
				identifyCurrentUser(postHog);
				postHog.opt_in_capturing();
			} else {
				postHog.opt_out_capturing();
			}
		},
		[postHog]
	);

	const reset = useCallback(() => {
		postHog.reset();
	}, [postHog]);

	const capture = useCallback<Tracker['capture']>(
		(eventName, properties, options) => {
			postHog.capture(eventName, properties, options);
		},
		[postHog]
	);

	return { enableTracker, reset, capture };
};
