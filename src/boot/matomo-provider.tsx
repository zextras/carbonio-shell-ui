/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { MATOMO_SHELL_SITE_ID } from '../constants';

export type MatomoWindowObj = Array<unknown[] | Record<string, unknown>>;

export class Matomo {
	private readonly siteId: string;

	constructor(siteId: string) {
		this.siteId = siteId;
	}

	static {
		window._paq = window._paq ?? [];
		const { _paq } = window;
		const URL = 'http://localhost:8080/';
		_paq.push(['setSiteId', MATOMO_SHELL_SITE_ID]);
		// _paq.push(['setCookiePath', modulePath]);
		// _paq.push(['setDomains', `${window.location.host}/${modulePath}`]);
		_paq.push(['trackPageView']);
		_paq.push(['enableLinkTracking']);
		_paq.push(['setTrackerUrl', `${URL}matomo.php`]);
		const matomoScript = document.createElement('script');
		const scriptElement = document.getElementsByTagName('script')[0];
		matomoScript.type = 'text/javascript';
		matomoScript.async = true;
		matomoScript.src = `${URL}matomo.js`;
		scriptElement.parentNode?.insertBefore(matomoScript, scriptElement);
	}

	public trackEvent(category: string, action: string, name?: string, ...value: unknown[]): void {
		const { _paq } = window;
		// const modulePath = window.location.pathname.split('/').slice(1, 3).join('/');
		// _paq.push(['setCookiePath', modulePath]);
		// _paq.push(['setDomains', `${window.location.host}/${modulePath}`]);
		// _paq.push(['setCustomUrl', window.location.href]);
		// _paq.push(['setDocumentTitle', window.document.title]);
		_paq?.push(['setSiteId', this.siteId]);
		_paq?.push(['trackEvent', category, action, name, ...value]);
		// _paq.push(['trackPageView']);
	}

	public trackPageView(): void {
		const { _paq } = window;
		_paq?.push(['setSiteId', this.siteId]);
		_paq?.push(['trackPageView']);
	}
}

export const MatomoContext = React.createContext<Matomo | undefined>(undefined);
