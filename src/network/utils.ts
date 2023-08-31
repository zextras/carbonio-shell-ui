/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function goToLogin(): void {
	window.location.assign(`${window.location.origin}/static/login`);
}

export function goTo(location: string): void {
	window.location.assign(location);
}
