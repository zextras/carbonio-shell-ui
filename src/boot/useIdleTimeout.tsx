/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Modal, Padding, Text } from '@zextras/carbonio-design-system';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';

import { logout } from '../network/logout';
import type { Duration } from '../types/account';
import { parseDuration } from '../utils/parseDuration';

const WARNING_TIME_MS = 60 * 1000;

/**
 * Hook to handle user inactivity timeout based on zimbraMailIdleSessionTimeout
 *
 * @param timeout - Duration string from account settings
 * @returns boolean indicating if the timeout warning is visible
 */
export const useIdleTimeout = (
	timeout?: Duration
): { isWarningVisible: boolean; reset: () => void } => {
	const [isWarningVisible, setIsWarningVisible] = useState(false);
	const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastActivityRef = useRef<number>(Date.now());
	const isMounted = useRef(true);

	const timeoutMs = parseDuration(timeout);

	const safeLogout = useCallback(() => {
		if (isMounted.current) {
			logout();
		}
	}, []);

	const clearAllTimers = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		if (warningTimeoutRef.current) {
			clearTimeout(warningTimeoutRef.current);
			warningTimeoutRef.current = null;
		}
	}, []);

	const showWarning = useCallback(() => {
		setIsWarningVisible(true);
	}, []);

	// Reset the idle timeout
	const resetTimeout = useCallback(
		(showWarningIfTimeoutExpired: boolean = false) => {
			lastActivityRef.current = Date.now();

			clearAllTimers();
			setIsWarningVisible(false);

			if (timeoutMs && timeoutMs > 0) {
				timeoutRef.current = setTimeout(safeLogout, timeoutMs);

				const warningTimeoutDuration = Math.max(0, timeoutMs - WARNING_TIME_MS);

				if (warningTimeoutDuration > 0) {
					warningTimeoutRef.current = setTimeout(showWarning, warningTimeoutDuration);
				} else if (showWarningIfTimeoutExpired) {
					showWarning();
				}
			}
		},
		[clearAllTimers, timeoutMs, safeLogout, showWarning]
	);

	const reset = useCallback(() => {
		resetTimeout(false);
	}, [resetTimeout]);

	// Handle user activity with debounce
	const debounceReset = useMemo(() => debounce(reset, 1000, { leading: true }), [reset]);

	// Handle visibility change for sleep/wake detection
	const handleVisibilityChange = useCallback(() => {
		const now = Date.now();

		if (document.hidden) {
			// No-op
		} else if (timeoutMs && timeoutMs > 0) {
			// Page became visible again, check if we should logout or reset timeout
			const timeSinceLastActivity = now - lastActivityRef.current;
			const remainingTime = timeoutMs - timeSinceLastActivity;

			if (remainingTime <= 0) {
				// Should have timed out while hidden, logout immediately
				safeLogout();
			} else {
				// Reset timeout with remaining time
				clearAllTimers();
				timeoutRef.current = setTimeout(safeLogout, remainingTime);
				if (remainingTime <= WARNING_TIME_MS) {
					showWarning();
				} else {
					warningTimeoutRef.current = setTimeout(showWarning, remainingTime - WARNING_TIME_MS);
				}
			}
		}
	}, [timeoutMs, safeLogout, clearAllTimers, showWarning]);

	useEffect(() => {
		isMounted.current = true;
		// If no timeout setting or invalid, do nothing
		if (!timeoutMs || timeoutMs <= 0) {
			return undefined;
		}

		// Set initial timeout
		resetTimeout(true);

		// Add event listeners for user activity
		document.addEventListener('wheel', debounceReset);
		document.addEventListener('keydown', debounceReset);

		// Add visibility change listener for sleep/wake detection
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			// Cleanup
			isMounted.current = false;
			clearAllTimers();
			document.removeEventListener('wheel', debounceReset);
			document.removeEventListener('keydown', debounceReset);
			document.removeEventListener('visibilitychange', handleVisibilityChange);

			// Cancel any pending debounced calls
			debounceReset.cancel();
		};
	}, [timeoutMs, resetTimeout, debounceReset, handleVisibilityChange, clearAllTimers]);

	useEffect(() => {
		if (!timeoutMs || timeoutMs <= 0 || isWarningVisible) {
			return undefined;
		}

		document.addEventListener('mouseup', debounceReset);

		return () => {
			document.removeEventListener('mouseup', debounceReset);
		};
	}, [timeoutMs, isWarningVisible, debounceReset]);

	return { isWarningVisible, reset };
};

interface IdleTimeoutModalProps {
	isOpen: boolean;
	reset: () => void;
}

export const IdleTimeoutModal = ({ isOpen, reset }: IdleTimeoutModalProps): React.JSX.Element => {
	const [t] = useTranslation();

	const modalText = useMemo(
		() =>
			t(
				'idleTimeout.modal.content',
				`You've been inactive for a while. You'll be logged out soon for security reasons. Press any key or click anywhere to stay logged in.`
			),
		[t]
	);

	const modalTitle = useMemo(() => t('idleTimeout.modal.title', 'Inactivity warning'), [t]);

	const modalConfirmLabel = useMemo(
		() => t('idleTimeout.modal.confirmLabel', 'Stay logged in'),
		[t]
	);

	const secondaryActionLabel = useMemo(() => t('label.logout', 'Logout'), [t]);

	return (
		<Modal
			open={isOpen}
			title={modalTitle}
			confirmLabel={modalConfirmLabel}
			showCloseIcon={false}
			onSecondaryAction={logout}
			secondaryActionLabel={secondaryActionLabel}
			onConfirm={reset}
			onClose={reset}
		>
			<Padding vertical="small">
				<Text color="text" overflow="break-word">
					{modalText}
				</Text>
			</Padding>
		</Modal>
	);
};
