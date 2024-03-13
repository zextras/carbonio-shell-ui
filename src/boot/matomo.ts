/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export interface MatomoTracker {
	trackPageView(customTitle?: string): void;
	trackEvent(category: string, action: string, name?: string, value?: number): void;
	setCustomUrl(url: string): void;
}

declare global {
	const Matomo: {
		getTracker(trackerUrl: string, siteId: number): MatomoTracker;
	};
}
export function initMatomo(url: string): void {
	const matomoScriptId = 'matomo-script';

	if (document.getElementById(matomoScriptId)) {
		return;
	}

	const matomoScript = document.createElement('script');
	const scriptElement = document.getElementsByTagName('script')[0];
	matomoScript.type = 'text/javascript';
	matomoScript.async = true;
	matomoScript.src = `${url}matomo.js`;
	matomoScript.id = matomoScriptId;
	scriptElement.parentNode?.insertBefore(matomoScript, scriptElement);
}

export function getMatomoTracker(url: string, siteId: number): MatomoTracker {
	return Matomo.getTracker(`${url}matomo.php`, siteId);
}
