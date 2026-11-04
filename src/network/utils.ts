/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { notifyBeforeShellExit } from './before-shell-exit';

export function goToLogin(): void {
	notifyBeforeShellExit();
	window.location.assign(`${window.location.origin}/static/login`);
}

export function goTo(location: string): void {
	notifyBeforeShellExit();
	window.location.assign(location);
}
