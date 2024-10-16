/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { ComponentType } from 'react';

declare global {
	const BASE_PATH: string;
	const POSTHOG_API_KEY: string;
	const POSTHOG_API_HOST: string;
	interface Window {
		__ZAPP_SHARED_LIBRARIES__?: {
			'@zextras/carbonio-shell-ui': {
				[appName: string]: unknown;
			};
			[externalDepName: string]: unknown;
		};
		__ZAPP_HMR_EXPORT__: { [pkgName: string]: (appClass: ComponentType) => void };
	}

	interface NotificationOptions {
		// experimental property https://developer.mozilla.org/en-US/docs/Web/API/Notification/vibrate
		vibrate?: number[];
	}
}
