/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// import { DevUtilsContext } from '../../types';

export default function loadDevelopmentEnv(ctxt: unknown /* DevUtilsContext */): Promise<void> {
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
