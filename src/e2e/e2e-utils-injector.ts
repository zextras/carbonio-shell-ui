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

import { E2EContext } from './e2e-types';

export default function loadDevelopmentEnv(ctxt: E2EContext): Promise<void> {
	return import(/* webpackChunkName: "e2e-utils" */ './e2e-utils')
		.then((
			{ default: injectE2EUtils, setCliSettings }
		) => injectE2EUtils(ctxt)
			.then(() => {
				switch (FLAVOR) {
					case 'E2E':
					case 'NPM':
						return fetch('/_cli')
							.then((data) => data.json())
							.then(setCliSettings)
							.then((cliSettings: cliSettingsNamespace) => {
								if (!cliSettings.server) {
									return e2e.setLoginData();
								}
							});
			}
		}));
}
