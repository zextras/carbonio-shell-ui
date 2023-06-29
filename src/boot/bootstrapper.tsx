/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect, useState } from 'react';
import { find } from 'lodash';
import { IS_STANDALONE } from '../constants';
import { AppLoaderMounter } from './app/app-loader-mounter';
import { ShellView } from '../shell/shell-view';
import { useAppStore } from '../store/app';
import { loginConfig } from '../network/login-config';
import { getComponents } from '../network/get-components';
import { getInfo } from '../network/get-info';
import { loadApps, unloadAllApps } from './app/load-apps';
import { GlobalProvidersWrapper } from './global-providers-wrapper';
import { Standalone } from './standalone';
import { LoaderFailureModal } from './loader';

export function isPromiseRejectedResult<T>(
	promiseSettledResult: PromiseSettledResult<T>
): promiseSettledResult is PromiseRejectedResult {
	return promiseSettledResult.status === 'rejected';
}

export function isPromiseFulfilledResult<T>(
	promiseSettledResult: PromiseSettledResult<T>
): promiseSettledResult is PromiseFulfilledResult<T> {
	return promiseSettledResult.status === 'fulfilled';
}

const Bootstrapper = (): JSX.Element => {
	const [open, setOpen] = useState(false);
	const closeHandler = useCallback(() => setOpen(false), []);

	useEffect(() => {
		Promise.allSettled([loginConfig(), getComponents(), getInfo()]).then(
			(promiseSettledResultArray) => {
				const [, getComponentsPromiseSettledResult, getInfoPromiseSettledResult] =
					promiseSettledResultArray;

				const promiseRejectedResult = find(
					[getComponentsPromiseSettledResult, getInfoPromiseSettledResult],
					isPromiseRejectedResult
				);
				if (promiseRejectedResult) {
					if (typeof promiseRejectedResult.reason === 'string') {
						console.error(promiseRejectedResult.reason);
					} else if ('message' in promiseRejectedResult.reason) {
						console.error(promiseRejectedResult.reason.message);
					}
					setOpen(true);
				}
				if (isPromiseFulfilledResult(getComponentsPromiseSettledResult)) {
					loadApps(Object.values(useAppStore.getState().apps));
				}
			}
		);
		return (): void => {
			unloadAllApps();
		};
	}, []);

	return (
		<GlobalProvidersWrapper>
			<LoaderFailureModal open={open} closeHandler={closeHandler} />
			{IS_STANDALONE && <Standalone />}
			<AppLoaderMounter />
			<ShellView />
		</GlobalProvidersWrapper>
	);
};

export default Bootstrapper;
