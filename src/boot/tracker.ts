/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getMatomoTracker, initMatomo, type MatomoTracker } from './matomo';

export class Tracker {
	private static readonly URL = 'https://analytics.zextras.tools/';

	private matomoTracker: MatomoTracker | null;

	private static isEnabled = false;

	private readonly siteId: number;

	constructor(siteId: number) {
		this.siteId = siteId;
		if (Tracker.isEnabled) {
			this.matomoTracker = getMatomoTracker(Tracker.URL, siteId);
		} else {
			this.matomoTracker = null;
		}
	}

	public static enableTracker(isEnabled: boolean): void {
		if (isEnabled) {
			initMatomo(Tracker.URL);
		}
		Tracker.isEnabled = isEnabled;
	}

	public trackPageView(customTitle?: string): void {
		const tracker = this.getMatomoTrackerInstance();
		tracker?.setCustomUrl(window.location.href);
		tracker?.trackPageView(customTitle);
	}

	public trackEvent(category: string, action: string, name?: string, value?: number): void {
		const tracker = this.getMatomoTrackerInstance();
		tracker?.setCustomUrl(window.location.href);
		tracker?.trackEvent(category, action, name, value);
	}

	private getMatomoTrackerInstance(): MatomoTracker | null {
		if (!Tracker.isEnabled) {
			return null;
		}
		if (this.matomoTracker === null) {
			try {
				this.matomoTracker = getMatomoTracker(Tracker.URL, this.siteId);
			} catch (e) {
				// eslint-disable-next-line no-console
				console.warn('Matomo is not initialized yet: ', e);
			}
		}
		return this.matomoTracker;
	}
}
