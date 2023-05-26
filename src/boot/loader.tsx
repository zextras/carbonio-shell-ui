/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Modal, Padding, Text } from '@zextras/carbonio-design-system';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { find } from 'lodash';
import { useAppStore } from '../store/app';
import { getInfo } from '../network/get-info';
import { loadApps, unloadAllApps } from './app/load-apps';
import { loginConfig } from '../network/login-config';
import { goToLogin } from '../network/go-to-login';
import { getComponents } from '../network/get-components';

export function isPromiseRejectedResult<T>(
	promiseSettledResult: PromiseSettledResult<T>
): promiseSettledResult is PromiseRejectedResult {
	return promiseSettledResult.status === 'rejected';
}

type LoaderFailureModalProps = { open: boolean; closeHandler: () => void };

export const LoaderFailureModal = ({
	open,
	closeHandler
}: LoaderFailureModalProps): JSX.Element => {
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

export const Loader: FC = () => {
	const [open, setOpen] = useState(false);
	const closeHandler = useCallback(() => setOpen(false), []);

	useEffect(() => {
		Promise.allSettled([loginConfig(), getComponents(), getInfo()])
			.then((promiseSettledResultArray) => {
				const promiseRejectedResult = find(promiseSettledResultArray, isPromiseRejectedResult);
				if (promiseRejectedResult) {
					if (typeof promiseRejectedResult.reason === 'string') {
						console.error(promiseRejectedResult.reason);
					} else if ('message' in promiseRejectedResult.reason) {
						console.error(promiseRejectedResult.reason.message);
					}
					setOpen(true);
				}
			})
			.finally(() => {
				loadApps(Object.values(useAppStore.getState().apps));
			});
		return () => {
			unloadAllApps();
		};
	}, []);
	return <LoaderFailureModal open={open} closeHandler={closeHandler} />;
};
