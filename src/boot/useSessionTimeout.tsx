/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useEffect, useState } from 'react';

import { useSnackbar } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

import { logout } from '../network/logout';

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

export const useSessionTimeout = (sessionLifetime: number | undefined): void => {
	const createSnackbar = useSnackbar();
	const [t] = useTranslation();

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
				// Calculate remaining session time
				const totalElapsedTime = now - sessionStartTime;
				const remainingLifetime = sessionLifetime - totalElapsedTime;

				setupTimeouts(remainingLifetime);
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
};
