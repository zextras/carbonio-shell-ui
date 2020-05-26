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

require.context(
	'file-loader?name=assets/[path][name].[ext]&context=assets/!../assets/',
	true,
	/.*/
);

require.context(
	'file-loader?name=shelli18n/[path][name].[ext]&context=translations/!../translations/',
	true,
	/.*/
);

import './index.css';

window.addEventListener('load', () => {
	Promise.all([
		import(/* webpackChunkName: "e2e-utils" */ './e2e/e2e-utils'),
		import(/* webpackChunkName: "bootstrapper" */ './bootstrap/bootstrapper')
	]).then(([
		{ default: injectE2EUtils, waitDevTools, setDevTools },
		{ boot }
	]) => {
		injectE2EUtils()
			.then(() => {
				switch (FLAVOR) {
					case 'NPM':
						fetch('/_cli')
							.then((data) => data.json())
							.then((data) => setDevTools(data));

						return waitDevTools()
							.then((setup: devtoolsNamespace) => {
								if (!setup.server) {
									return e2e.setLoginData();
								}
							});
				}
			})
			.then(boot);
	});


});
