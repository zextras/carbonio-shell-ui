/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { act, renderHook } from '@testing-library/react';
import type { MockInstance } from 'vitest';

import { useIdleTimeout } from './useIdleTimeout';
import { logout } from '../network/logout';

// Mock the logout function
vi.mock('../network/logout', () => ({
	logout: vi.fn()
}));

// Mock lodash debounce
vi.mock('lodash', () => ({
	debounce: vi.fn((fn) => {
		const debouncedFn = fn;
		debouncedFn.cancel = vi.fn();
		return debouncedFn;
	})
}));

describe('useIdleTimeout', () => {
	let mockDateNow: MockInstance;
	let mockSetTimeout: MockInstance;
	let mockClearTimeout: MockInstance;

	beforeEach(() => {
		vi.clearAllMocks();
		vi.clearAllTimers();
		mockDateNow = vi.spyOn(Date, 'now');
		mockSetTimeout = vi.spyOn(global, 'setTimeout');
		mockClearTimeout = vi.spyOn(global, 'clearTimeout');
	});

	afterEach(() => {
		mockDateNow.mockRestore();
		mockSetTimeout.mockRestore();
		mockClearTimeout.mockRestore();
	});

	it('should do nothing when timeout is not provided', () => {
		const { unmount } = renderHook(() => useIdleTimeout(undefined));
		expect(mockSetTimeout).not.toHaveBeenCalled();
		unmount();
	});

	it('should do nothing when timeout is 0', () => {
		const { unmount } = renderHook(() => useIdleTimeout('0s'));
		expect(mockSetTimeout).not.toHaveBeenCalled();
		unmount();
	});

	it('should setup and cleanup properly for valid duration', () => {
		const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

		const { unmount } = renderHook(() => useIdleTimeout('10s'));

		expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 10000);
		expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
		expect(addEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function));
		expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
		expect(addEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

		unmount();

		expect(mockClearTimeout).toHaveBeenCalled();
		expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
		expect(removeEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function));
		expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
		expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
	});

	it('should logout when timeout expires', () => {
		renderHook(() => useIdleTimeout('5s'));

		act(() => {
			vi.advanceTimersByTime(5000);
		});

		expect(logout).toHaveBeenCalled();
	});

	it('should reset timeout on user activity', () => {
		const { unmount } = renderHook(() => useIdleTimeout('70s'));

		// Simulate mouse activity
		act(() => {
			document.dispatchEvent(new Event('mouseup'));
		});

		expect(mockClearTimeout).toHaveBeenCalled();
		expect(mockSetTimeout).toHaveBeenCalledTimes(4); // Initial + reset

		unmount();
	});

	it('should reset timeout on wheel activity', () => {
		const { unmount } = renderHook(() => useIdleTimeout('10s'));

		// Simulate wheel activity
		act(() => {
			document.dispatchEvent(new Event('wheel'));
		});

		expect(mockClearTimeout).toHaveBeenCalled();
		expect(mockSetTimeout).toHaveBeenCalledTimes(2); // Initial + reset

		unmount();
	});

	it('should reset timeout on keydown activity', () => {
		const { unmount } = renderHook(() => useIdleTimeout('10s'));

		// Simulate keydown activity
		act(() => {
			document.dispatchEvent(new Event('keydown'));
		});

		expect(mockClearTimeout).toHaveBeenCalled();
		expect(mockSetTimeout).toHaveBeenCalledTimes(2); // Initial + reset

		unmount();
	});

	describe('visibility change handling', () => {
		it('should do nothing when page becomes hidden', () => {
			mockDateNow.mockReturnValue(1000);
			renderHook(() => useIdleTimeout('10s'));

			const initialSetTimeoutCalls = mockSetTimeout.mock.calls.length;

			Object.defineProperty(document, 'hidden', { value: true, configurable: true });
			document.dispatchEvent(new Event('visibilitychange'));

			expect(mockSetTimeout.mock.calls.length).toBe(initialSetTimeoutCalls);
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

			// Page becomes visible after 3 more seconds (5 seconds total)
			mockDateNow.mockReturnValue(startTime + 5000);
			Object.defineProperty(document, 'hidden', { value: false, configurable: true });
			act(() => {
				document.dispatchEvent(new Event('visibilitychange'));
			});

			// Should set timeout with remaining 5 seconds
			expect(mockSetTimeout).toHaveBeenLastCalledWith(expect.any(Function), 5000);
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
