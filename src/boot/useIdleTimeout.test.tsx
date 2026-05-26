/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { act, renderHook } from '@testing-library/react';
import type { MockInstance } from 'vitest';

import { useIdleTimeout } from './useIdleTimeout';
import { logout } from '../network/logout';

vi.mock('../network/logout', () => ({
	logout: vi.fn()
}));

// debounce mock: invokes immediately so dispatched events propagate synchronously in tests
vi.mock('lodash', () => ({
	debounce: vi.fn((fn) => {
		const debouncedFn = fn;
		debouncedFn.cancel = vi.fn();
		return debouncedFn;
	})
}));

describe('useIdleTimeout', () => {
	let mockDateNow: MockInstance;

	beforeEach(() => {
		vi.clearAllMocks();
		vi.clearAllTimers();
		mockDateNow = vi.spyOn(Date, 'now');
	});

	afterEach(() => {
		mockDateNow.mockRestore();
	});

	it('should not logout when timeout is not provided', () => {
		renderHook(() => useIdleTimeout(undefined));

		act(() => {
			vi.advanceTimersByTime(60 * 60 * 1000);
		});

		expect(logout).not.toHaveBeenCalled();
	});

	it('should not logout when timeout is 0', () => {
		renderHook(() => useIdleTimeout('0s'));

		act(() => {
			vi.advanceTimersByTime(60 * 60 * 1000);
		});

		expect(logout).not.toHaveBeenCalled();
	});

	it('should logout when timeout expires', () => {
		renderHook(() => useIdleTimeout('5s'));

		act(() => {
			vi.advanceTimersByTime(5000);
		});

		expect(logout).toHaveBeenCalled();
	});

	it('should not logout after unmount, even when the timeout would have expired', () => {
		const { unmount } = renderHook(() => useIdleTimeout('5s'));
		unmount();

		act(() => {
			vi.advanceTimersByTime(60 * 1000);
		});

		expect(logout).not.toHaveBeenCalled();
	});

	// The hook detaches the `mouseup` listener as soon as the inactivity warning
	// becomes visible (60s before the timeout). Using a timeout well above that
	// threshold lets us advance the clock without entering the warning state,
	// so the same scenario covers mouseup, wheel and keydown.
	it.each(['mouseup', 'wheel', 'keydown'])(
		'should reset the timeout when a %s event is dispatched',
		(eventName) => {
			renderHook(() => useIdleTimeout('200s'));

			// Close to (but under) the original timeout's expiry.
			act(() => {
				vi.advanceTimersByTime(130_000);
			});

			act(() => {
				document.dispatchEvent(new Event(eventName));
			});

			// Past the original timeout's wall-clock expiry (130s + 80s = 210s > 200s),
			// but only 80s since the reset → no logout yet.
			act(() => {
				vi.advanceTimersByTime(80_000);
			});
			expect(logout).not.toHaveBeenCalled();

			// A full timeout window after the reset has elapsed → logout fires.
			act(() => {
				vi.advanceTimersByTime(130_000);
			});
			expect(logout).toHaveBeenCalled();
		}
	);

	describe('visibility change handling', () => {
		it('should do nothing when page becomes hidden', () => {
			mockDateNow.mockReturnValue(1000);
			renderHook(() => useIdleTimeout('10s'));

			Object.defineProperty(document, 'hidden', { value: true, configurable: true });
			document.dispatchEvent(new Event('visibilitychange'));

			// No logout yet, and the original timeout still drives behaviour.
			expect(logout).not.toHaveBeenCalled();
		});

		it('should logout immediately when timeout expired while hidden', () => {
			const startTime = 1000;
			mockDateNow.mockReturnValue(startTime);

			renderHook(() => useIdleTimeout('5s'));

			// Page becomes hidden
			Object.defineProperty(document, 'hidden', { value: true, configurable: true });
			document.dispatchEvent(new Event('visibilitychange'));

			// Page becomes visible after timeout expired
			mockDateNow.mockReturnValue(startTime + 6000); // 6 seconds later
			Object.defineProperty(document, 'hidden', { value: false, configurable: true });
			document.dispatchEvent(new Event('visibilitychange'));

			expect(logout).toHaveBeenCalled();
		});

		it('should reset timeout with remaining time when page becomes visible', () => {
			const startTime = 1000;
			mockDateNow.mockReturnValue(startTime);

			renderHook(() => useIdleTimeout('10s'));

			// Page becomes hidden after 2 seconds
			mockDateNow.mockReturnValue(startTime + 2000);
			Object.defineProperty(document, 'hidden', { value: true, configurable: true });
			act(() => {
				document.dispatchEvent(new Event('visibilitychange'));
			});

			// Page becomes visible after 3 more seconds (5 seconds total elapsed)
			mockDateNow.mockReturnValue(startTime + 5000);
			Object.defineProperty(document, 'hidden', { value: false, configurable: true });
			act(() => {
				document.dispatchEvent(new Event('visibilitychange'));
			});

			// Less than the remaining 5s after visibility restored → no logout yet.
			act(() => {
				vi.advanceTimersByTime(4000);
			});
			expect(logout).not.toHaveBeenCalled();

			// After the remaining 5s elapses → logout fires.
			act(() => {
				vi.advanceTimersByTime(1000);
			});
			expect(logout).toHaveBeenCalled();
		});

		it('should handle visibility change when no timeout is set', () => {
			renderHook(() => useIdleTimeout(undefined));

			Object.defineProperty(document, 'hidden', { value: false, configurable: true });
			document.dispatchEvent(new Event('visibilitychange'));

			// Should not cause any errors
			expect(logout).not.toHaveBeenCalled();
		});
	});
});
