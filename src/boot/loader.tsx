/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect, useState } from 'react';

import { Modal, Padding, Text, useSnackbar } from '@zextras/carbonio-design-system';
import { find } from 'lodash';
import { useTranslation } from 'react-i18next';

import { loadApps, unloadAllApps } from './app/load-apps';
import { useTracker } from './posthog';
import { IS_FOCUS_MODE } from '../constants';
import { getComponents } from '../network/get-components';
import { getInfo } from '../network/get-info';
import { loginConfig } from '../network/login-config';
import { logout } from '../network/logout';
import { useAccountStore } from '../store/account';
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
	const onConfirm = useCallback(() => {
		window.location.reload();
	}, []);
	const onSecondaryAction = useCallback(() => {
		logout();
	}, []);
	return (
		<Modal
			open={open}
			showCloseIcon={false}
			onSecondaryAction={onSecondaryAction}
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

function calcInitialCounter(sessionLifetime: number): number {
	const oneMinute = 60 * 1000;
	return Math.ceil(Math.min(sessionLifetime, oneMinute) / 1000);
}

const ExpiringSessionDynamicLabel = ({
	sessionLifetime
}: {
	sessionLifetime: number;
}): React.JSX.Element => {
	const [t] = useTranslation();
	const [count, setCount] = useState(calcInitialCounter(sessionLifetime));

	useEffect(() => {
		const interval = setInterval(() => {
			setCount((prevState) => prevState - 1);
		}, 1000);

		return (): void => {
			clearInterval(interval);
		};
	}, []);

	return (
		<>
			{t('snackbar.expiration.oneMinute', {
				defaultValue_one:
					"Your session will expire in {{count}} second. After that, you'll be redirected to the login page.",
				defaultValue_other:
					"Your session will expire in {{count}} seconds. After that, you'll be redirected to the login page.",
				count
			})}
		</>
	);
};

export const Loader = (): React.JSX.Element => {
	const [t] = useTranslation();
	const [open, setOpen] = useState(false);
	const closeHandler = useCallback(() => setOpen(false), []);
	const [sessionLifetime, setSessionLifetime] = useState<number>();
	const createSnackbar = useSnackbar();

	const getSessionInfo = useCallback(
		() =>
			getInfo().then((sessionInfo) => {
				setSessionLifetime(sessionInfo.lifetime);
			}),
		[]
	);

	const carbonioPrefSendAnalytics = useAccountStore(
		(state) => state.settings.prefs.carbonioPrefSendAnalytics
	);

	const { enableTracker } = useTracker();

	useEffect(() => {
		enableTracker(carbonioPrefSendAnalytics === 'TRUE');
	}, [carbonioPrefSendAnalytics, enableTracker]);

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
				} else {
					loadApps(Object.values(useAppStore.getState().apps));
				}
			}
		);
		return () => {
			unloadAllApps();
		};
	}, [getSessionInfo]);

	useEffect(() => {
		const expirationTimeouts: NodeJS.Timeout[] = [];
		const logoutFn = (): void => {
			logout();
		};
		if (sessionLifetime !== undefined) {
			const tenMinutes = 10 * 60 * 1000;
			if (sessionLifetime >= tenMinutes) {
				expirationTimeouts.push(
					setTimeout(() => {
						createSnackbar({
							severity: 'info',
							key: 'ten-minutes-from-expiration-snackbar',
							autoHideTimeout: 10 * 1000,
							label: t(
								'snackbar.expiration.tenMinutes',
								"Your session will expire in 10 minutes. After that, you'll be redirected to the login page."
							),
							actionLabel: t('snackbar.expiration.action', 'Go to login page'),
							onActionClick: logoutFn
						});
					}, sessionLifetime - tenMinutes)
				);
			}

			const threeMinutes = 3 * 60 * 1000;
			if (sessionLifetime >= threeMinutes) {
				expirationTimeouts.push(
					setTimeout(() => {
						createSnackbar({
							severity: 'info',
							key: 'three-minutes-from-expiration-snackbar',
							disableAutoHide: true,
							label: t(
								'snackbar.expiration.threeMinutes',
								"Your session will expire in 3 minutes. After that, you'll be redirected to the login page."
							),
							actionLabel: t('snackbar.expiration.action', 'Go to login page'),
							onActionClick: logoutFn
						});
					}, sessionLifetime - threeMinutes)
				);
			}

			const oneMinute = 60 * 1000;
			expirationTimeouts.push(
				setTimeout(
					() => {
						createSnackbar({
							severity: 'warning',
							key: 'one-minute-from-expiration-snackbar',
							autoHideTimeout: Math.min(oneMinute, sessionLifetime),
							label: <ExpiringSessionDynamicLabel sessionLifetime={sessionLifetime} />,
							actionLabel: t('snackbar.expiration.action', 'Go to login page'),
							onActionClick: logoutFn,
							replace: true
						});
						expirationTimeouts.push(setTimeout(logoutFn, Math.min(oneMinute, sessionLifetime)));
					},
					Math.max(sessionLifetime - oneMinute, 0)
				)
			);
		}

		return (): void => {
			expirationTimeouts.forEach((timeout) => {
				clearTimeout(timeout);
			});
		};
	}, [createSnackbar, sessionLifetime, t]);

	return <LoaderFailureModal open={open} closeHandler={closeHandler} />;
};
