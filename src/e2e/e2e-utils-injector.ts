/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import { E2EContext } from './e2e-types';
import { generateWorker } from '../mocks/browser';

export default function loadDevelopmentEnv(ctxt: E2EContext): Promise<void> {
	return import(/* webpackChunkName: "e2e-utils" */ './e2e-utils')
		.then((
			{ default: injectE2EUtils, setCliSettings, waitForE2ESetupCompleted }
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
									const worker = generateWorker(cliSettings);
									// eslint-disable-next-line no-param-reassign
									ctxt.mswjs = worker;
									return worker.start()
										// .then(() => e2e.setLoginData())
										.then(() => {
											if (cliSettings.isE2E) return waitForE2ESetupCompleted();
											return undefined;
										})
										.catch((err) => {
											console.error(err);
											throw err;
										});
								}
								return undefined;
							});
					default:
						return undefined;
				}
			}));
}
