/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { ComponentType } from 'react';

import type * as ExportsForApp from './lib';

declare global {
	const BASE_PATH: string;
	interface Window {
		__ZAPP_SHARED_LIBRARIES__?: {
			'@zextras/carbonio-shell-ui': {
				[appName: string]: typeof ExportsForApp;
			};
			[externalDepName: string]: unknown;
		};
		__ZAPP_HMR_EXPORT__: { [pkgName: string]: (appClass: ComponentType) => void };
	}
}
