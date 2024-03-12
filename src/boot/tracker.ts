/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

interface MatomoTracker {
	trackPageView(customTitle?: string): void;
	trackEvent(category: string, action: string, name?: string, value?: number): void;
	setCustomUrl(url: string): void;
}

declare global {
	const Matomo: {
		getTracker(trackerUrl: string, siteId: number): MatomoTracker;
	};
}
export class Tracker {
	private static readonly URL = 'https://analytics.zextras.tools/';

	private matomoTracker: MatomoTracker | null;

	private static isEnabled = false;

	private readonly siteId: number;

	private static initMatomo(): void {
		const matomoScriptId = 'matomo-script';

		if (document.getElementById(matomoScriptId)) {
			return;
		}

		const matomoScript = document.createElement('script');
		const scriptElement = document.getElementsByTagName('script')[0];
		matomoScript.type = 'text/javascript';
		matomoScript.async = true;
		matomoScript.src = `${Tracker.URL}matomo.js`;
		matomoScript.id = matomoScriptId;
		scriptElement.parentNode?.insertBefore(matomoScript, scriptElement);
	}

	constructor(siteId: number) {
		this.siteId = siteId;
		if (Tracker.isEnabled) {
			this.matomoTracker = Matomo.getTracker(`${Tracker.URL}matomo.php`, siteId);
		} else {
			this.matomoTracker = null;
		}
	}

	public static setEnableTracker(isEnabled: boolean): void {
		if (isEnabled) {
			Tracker.initMatomo();
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
				this.matomoTracker = Matomo.getTracker(`${Tracker.URL}matomo.php`, this.siteId);
			} catch (e) {
				console.warn('Matomo is not initialized yet: ', e);
			}
		}
		return this.matomoTracker;
	}
}
