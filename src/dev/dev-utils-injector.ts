/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// import { DevUtilsContext } from '../../types';

export default function loadDevelopmentEnv(ctxt: unknown /* DevUtilsContext */): Promise<void> {
	return import(/* webpackChunkName: "dev-utils" */ './dev-utils').then(
		({ default: injectDevUtils, setCliSettings }) =>
			injectDevUtils(ctxt).then(() => {
				if (__CARBONIO_DEV__) {
					return fetch('/_cli')
						.then((data) => data.json())
						.then(setCliSettings);
				}
				return undefined;
			})
	);
}
