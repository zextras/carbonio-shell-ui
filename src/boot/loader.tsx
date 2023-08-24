/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect, useState } from 'react';

import { Modal, Padding, Text } from '@zextras/carbonio-design-system';
import { find } from 'lodash';
import { useTranslation } from 'react-i18next';

import { loadApps, unloadAllApps } from './app/load-apps';
import { IS_STANDALONE } from '../constants';
import { getComponents } from '../network/get-components';
import { getInfo } from '../network/get-info';
import { loginConfig } from '../network/login-config';
import { goToLogin } from '../network/utils';
import { useAppStore } from '../store/app';

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

type LoaderFailureModalProps = { open: boolean; closeHandler: () => void };

export const LoaderFailureModal = ({
	open,
	closeHandler
}: LoaderFailureModalProps): React.JSX.Element => {
	const [t] = useTranslation();
	const onConfirm = useCallback(() => window.location.reload(), []);
	return (
		<Modal
			open={open}
			showCloseIcon={false}
			onSecondaryAction={goToLogin}
			title={t('bootstrap.failure.modal.title', 'Something went wrong...')}
			confirmLabel={t('bootstrap.failure.modal.confirmButtonLabel', 'refresh')}
			secondaryActionLabel={t('bootstrap.failure.modal.secondaryButtonLabel', 'login page')}
			onConfirm={onConfirm}
			onClose={closeHandler}
		>
			<Padding all="small">
				<Text overflow="break-word">
					{t(
						'bootstrap.failure.modal.body',
						'Some technical issues occurred while processing your request. Please try to refresh the page or go back to the login page.'
					)}
				</Text>
			</Padding>
		</Modal>
	);
};

export const Loader = (): React.JSX.Element => {
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
					if (!IS_STANDALONE) {
						setOpen(true);
					}
				}
				if (isPromiseFulfilledResult(getComponentsPromiseSettledResult)) {
					loadApps(Object.values(useAppStore.getState().apps));
				}
			}
		);
		return () => {
			unloadAllApps();
		};
	}, []);
	return <LoaderFailureModal open={open} closeHandler={closeHandler} />;
};
