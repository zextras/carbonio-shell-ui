/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { MatomoTracker } from '../matomo';

export function initMatomo(): void {
	// do nothing
}

export function getMatomoTracker(): MatomoTracker {
	return {
		trackEvent: () => undefined,
		trackPageView: () => undefined,
		setCustomUrl: () => undefined
	};
}
