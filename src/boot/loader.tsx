/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect, useState } from 'react';

import { Modal, Padding, Text, useSnackbar } from '@zextras/carbonio-design-system';
import type { UserQuotaChangeEvent } from '@zextras/carbonio-ui-soap-lib';
import { ApiEvents, GET_INFO_RIGHTS, api } from '@zextras/carbonio-ui-soap-lib';
import { find } from 'lodash';
import { useTranslation } from 'react-i18next';

import { loadApps, unloadAllApps } from './app/load-apps';
import { IS_FOCUS_MODE } from '../constants';
import { getComponents } from '../network/get-components';
import { loginConfig } from '../network/login-config';
import { logout } from '../network/logout';
import { goToLogin } from '../network/utils';
import { useAccountStore } from '../store/account';
import { normalizeAccount } from '../store/account/normalization';
import { useAppStore } from '../store/app';
import { useTracker } from '../tracker/tracker';

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

	const carbonioPrefSendAnalytics = useAccountStore(
		(state) => state.settings.prefs.carbonioPrefSendAnalytics
	);

	const { enableTracker } = useTracker();

	const getSessionInfo = useCallback(() => {
		const rights = [
			GET_INFO_RIGHTS.sendAs,
			GET_INFO_RIGHTS.sendAsDistList,
			GET_INFO_RIGHTS.viewFreeBusy,
			GET_INFO_RIGHTS.sendOnBehalfOf,
			GET_INFO_RIGHTS.sendOnBehalfOfDistList
		];

		return api.getInfo({ rights }).then((res) => {
			const { account, settings } = normalizeAccount(res);
			useAccountStore.setState({
				authenticated: true,
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

	useEffect(() => {
		if (sessionLifetime === undefined) {
			return undefined;
		}

		const expirationTimeouts: NodeJS.Timeout[] = [];
		const logoutFn = (): void => {
			logout();
		};

		// Track session state for sleep/wake detection
		const sessionStartTime = Date.now();
		let lastHiddenTime = 0;
		let totalSleepTime = 0;

		const setupTimeouts = (remainingLifetime: number): void => {
			// Clear existing timeouts
			expirationTimeouts.forEach(clearTimeout);
			expirationTimeouts.length = 0;

			if (remainingLifetime <= 0) {
				// Session has already expired, logout immediately
				logoutFn();
				return;
			}

			const tenMinutes = 10 * 60 * 1000;
			if (remainingLifetime >= tenMinutes) {
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
					}, remainingLifetime - tenMinutes)
				);
			}

			const threeMinutes = 3 * 60 * 1000;
			if (remainingLifetime >= threeMinutes) {
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
					}, remainingLifetime - threeMinutes)
				);
			}

			const oneMinute = 60 * 1000;
			expirationTimeouts.push(
				setTimeout(
					() => {
						createSnackbar({
							severity: 'warning',
							key: 'one-minute-from-expiration-snackbar',
							autoHideTimeout: Math.min(oneMinute, remainingLifetime),
							label: <ExpiringSessionDynamicLabel sessionLifetime={remainingLifetime} />,
							actionLabel: t('snackbar.expiration.action', 'Go to login page'),
							onActionClick: logoutFn,
							replace: true
						});
						expirationTimeouts.push(setTimeout(logoutFn, Math.min(oneMinute, remainingLifetime)));
					},
					Math.max(remainingLifetime - oneMinute, 0)
				)
			);
		};

		const handleVisibilityChange = (): void => {
			const now = Date.now();

			if (document.hidden) {
				// Page became hidden, record the time
				lastHiddenTime = now;
			} else if (lastHiddenTime > 0) {
				// Page became visible again, check for time gap
				const hiddenDuration = now - lastHiddenTime;
				const SLEEP_DETECTION_THRESHOLD = 60 * 1000; // 1 minute threshold

				if (hiddenDuration > SLEEP_DETECTION_THRESHOLD) {
					// Significant time gap detected, add to total sleep time
					totalSleepTime += hiddenDuration;

					// Calculate remaining session time accounting for sleep
					const activeTime = now - sessionStartTime - totalSleepTime;
					const remainingLifetime = sessionLifetime - activeTime;

					// Recalculate and reset timeouts with actual remaining time
					setupTimeouts(remainingLifetime);
				}
				lastHiddenTime = 0;
			}
		};

		// Set up initial timeouts
		setupTimeouts(sessionLifetime);

		// Add visibility change listener
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			expirationTimeouts.forEach((timeout) => {
				clearTimeout(timeout);
			});
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [createSnackbar, sessionLifetime, t]);

	return <LoaderFailureModal open={open} closeHandler={closeHandler} />;
};
