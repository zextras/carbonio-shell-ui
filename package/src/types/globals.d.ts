/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiManager } from '../ApiManager';

declare global {
	interface Window {
		carbonioApiManager?: ApiManager;
	}
}
