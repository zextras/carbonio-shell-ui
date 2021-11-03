/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import { DevUtilsContext } from '../../types';

export default function loadDevelopmentEnv(ctxt: DevUtilsContext): Promise<void> {
	return import(/* webpackChunkName: "dev-utils" */ './dev-utils').then(
		({ default: injectDevUtils, setCliSettings }) =>
			injectDevUtils(ctxt).then(() => {
				switch (FLAVOR) {
					case 'NPM':
						return fetch('/_cli')
							.then((data) => data.json())
							.then(setCliSettings)
							.then((cliSettings: cliSettingsNamespace) => {
								// const worker = generateWorker(cliSettings);
								// eslint-disable-next-line no-param-reassign
								// ctxt.mswjs = worker;
								// return worker
								// 	.start()
								// 	.then(() => undefined)
								// 	.catch((err) => {
								// 		console.error(err);
								// 		throw err;
								// 	});
							});
					default:
						return undefined;
				}
			})
	);
}
