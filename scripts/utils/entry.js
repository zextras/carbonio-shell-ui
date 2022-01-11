/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable no-undef */


async function bootApp() {
	const appEntrypoint = await import('app-entrypoint');

	const App = (appEntrypoint && appEntrypoint.default) || appEntrypoint;
	window.__ZAPP_HMR_EXPORT__[PACKAGE_NAME](App);
}

bootApp();

if (module.hot) {
	module.hot.accept('app-entrypoint', bootApp);
}
