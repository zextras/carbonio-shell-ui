/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import { zimletToAppPkgDescription, zimletToThemePkgDescription } from './utils';

describe('Network SOAP Utils', () => {
	test('Zimlet to App', () => {
		const app = zimletToAppPkgDescription({
			zimletContext: [{
				baseUrl: '/service/zimlet/com_zextras_zapp_app/',
				priority: 10,
				presence: 'enabled'
			}],
			zimlet: [{
				description: 'App for Shell',
				zapp: 'true',
				'zapp-main': 'app.bundle.js',
				label: 'App',
				name: 'com_zextras_zapp_app',
				version: '0.0.1',
				'zapp-serviceworker-extension': 'serviceworker.com_zextras_zapp_app.bundle.js'
			}]
		});
		expect(app).toStrictEqual({
			package: 'com_zextras_zapp_app',
			name: 'App',
			version: '0.0.1',
			priority: 10,
			resourceUrl: '/zx/zimlet/com_zextras_zapp_app',
			description: 'App for Shell',
			entryPoint: 'app.bundle.js',
			styleEntryPoint: undefined,
			swExtension: 'serviceworker.com_zextras_zapp_app.bundle.js',
		});
	});

	test('Zimlet to Theme', () => {
		const theme = zimletToThemePkgDescription({
			zimletContext: [{
				baseUrl: '/service/zimlet/com_zextras_zapp_theme/',
				priority: 10,
				presence: 'enabled'
			}],
			zimlet: [{
				description: 'Theme for Shell',
				zapp: 'true',
				'zapp-theme': 'theme.bundle.js',
				label: 'Theme',
				name: 'com_zextras_zapp_theme',
				version: '0.0.1',
			}]
		});
		expect(theme).toStrictEqual({
			package: 'com_zextras_zapp_theme',
			name: 'Theme',
			version: '0.0.1',
			priority: 10,
			resourceUrl: '/zx/zimlet/com_zextras_zapp_theme',
			description: 'Theme for Shell',
			entryPoint: 'theme.bundle.js',
		});
	});
});
