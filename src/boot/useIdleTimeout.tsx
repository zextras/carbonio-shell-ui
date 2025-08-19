/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { debounce } from 'lodash';

import { logout } from '../network/logout';
import type { Duration } from '../types/account';
import { parseDuration } from '../utils/parseDuration';

/**
 * Hook to handle user inactivity timeout based on zimbraMailIdleSessionTimeout
 *
 * @param zimbraMailIdleSessionTimeout - Duration string from account settings
 */
export const useIdleTimeout = (zimbraMailIdleSessionTimeout?: Duration): void => {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastActivityRef = useRef<number>(Date.now());

	// Parse the timeout duration
	const timeoutMs = parseDuration(zimbraMailIdleSessionTimeout);

	// Reset the idle timeout
	const resetTimeout = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		if (timeoutMs && timeoutMs > 0) {
			timeoutRef.current = setTimeout(logout, timeoutMs);
		}
	}, [timeoutMs]);

	// Handle user activity with debounce
	const handleActivity = useMemo(
		() =>
			debounce(() => {
				lastActivityRef.current = Date.now();
				resetTimeout();
			}, 200),
		[resetTimeout]
	);

	// Handle visibility change for sleep/wake detection
	const handleVisibilityChange = useCallback(() => {
		const now = Date.now();

		if (document.hidden) {
			// Page became hidden, we don't need to do anything special
			// lastActivityRef.current already tracks the last activity
		} else if (timeoutMs && timeoutMs > 0) {
			// Page became visible again, check if we should logout or reset timeout
			const timeSinceLastActivity = now - lastActivityRef.current;
			const remainingTime = timeoutMs - timeSinceLastActivity;

			if (remainingTime <= 0) {
				// Should have timed out while hidden, logout immediately
				logout();
			} else {
				// Reset timeout with remaining time
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
				timeoutRef.current = setTimeout(() => {
					logout();
				}, remainingTime);
			}
		}
	}, [timeoutMs]);

	useEffect(() => {
		// If no timeout setting or invalid, do nothing
		if (!timeoutMs || timeoutMs <= 0) {
			return undefined;
		}

		// Set initial timeout
		resetTimeout();

		// Add event listeners for user activity
		window.addEventListener('mouseup', handleActivity);
		window.addEventListener('mousewheel', handleActivity);

		// Add visibility change listener for sleep/wake detection
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			// Cleanup
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			window.removeEventListener('mouseup', handleActivity);
			window.removeEventListener('mousewheel', handleActivity);
			document.removeEventListener('visibilitychange', handleVisibilityChange);

			// Cancel any pending debounced calls
			handleActivity.cancel();
		};
	}, [timeoutMs, resetTimeout, handleActivity, handleVisibilityChange]);
};
