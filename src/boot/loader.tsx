/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect, useState } from 'react';

import { Modal, Padding, Text } from '@zextras/carbonio-design-system';
import type { UserQuotaChangeEvent } from '@zextras/carbonio-ui-soap-lib';
import { ApiEvents, GET_INFO_RIGHTS, api } from '@zextras/carbonio-ui-soap-lib';
import { find } from 'lodash';
import { useTranslation } from 'react-i18next';

import { loadApps, unloadAllApps } from './app/load-apps';
import { IdleTimeoutModal, useIdleTimeout } from './useIdleTimeout';
import { useSessionTimeout } from './useSessionTimeout';
import { IS_FOCUS_MODE } from '../constants';
import { getComponents } from '../network/get-components';
import { loginConfig } from '../network/login-config';
import { goToLogin } from '../network/utils';
import { useAccountStore } from '../store/account';
import { normalizeAccount } from '../store/account/normalization';
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
	const [sessionLifetime, setSessionLifetime] = useState<number>();

	const zimbraMailIdleSessionTimeout = useAccountStore(
		(state) => state.settings.attrs.zimbraMailIdleSessionTimeout
	);

	const getSessionInfo = useCallback(() => {
		const rights = [
			GET_INFO_RIGHTS.sendAs,
			GET_INFO_RIGHTS.sendAsDistList,
			GET_INFO_RIGHTS.viewFreeBusy,
			GET_INFO_RIGHTS.sendOnBehalfOf,
			GET_INFO_RIGHTS.sendOnBehalfOfDistList
		];

		return api.getInfo({ rights }).then((res) => {
			const { account, settings, changePasswordURL } = normalizeAccount(res);
			useAccountStore.setState({
				authenticated: true,
				changePasswordURL,
				account,
				settings
			});
			setSessionLifetime(res.lifetime);
		});
	}, []);

	const authErrorListener = useCallback(() => {
		if (IS_FOCUS_MODE) {
			useAccountStore.setState({ authenticated: false });
		} else {
			goToLogin();
		}
	}, []);

	const userQuotaEventLister = useCallback(
		(e: CustomEventInit<UserQuotaChangeEvent['payload']>): void => {
			useAccountStore.setState({ usedQuota: e.detail?.quota });
		},
		[]
	);

	useEffect(() => {
		window.addEventListener(ApiEvents.AuthError, authErrorListener);

		return () => {
			window.removeEventListener(ApiEvents.AuthError, authErrorListener);
		};
	}, [authErrorListener]);

	useEffect(() => {
		window.addEventListener(ApiEvents.UserQuotaChange, userQuotaEventLister);

		return () => {
			window.removeEventListener(ApiEvents.UserQuotaChange, userQuotaEventLister);
		};
	}, [userQuotaEventLister]);

	useEffect(() => {
		Promise.allSettled([loginConfig(), getComponents(), getSessionInfo()]).then(
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
					if (!IS_FOCUS_MODE) {
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
	}, [getSessionInfo]);

	useSessionTimeout(sessionLifetime);
	const { isWarningVisible, reset } = useIdleTimeout(zimbraMailIdleSessionTimeout);

	return (
		<>
			<LoaderFailureModal open={open} closeHandler={closeHandler} />
			{zimbraMailIdleSessionTimeout && <IdleTimeoutModal isOpen={isWarningVisible} reset={reset} />}
		</>
	);
};
