/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { renderHook } from '@testing-library/react';

import { useSessionTimeout } from './useSessionTimeout';

jest.mock('../network/logout');
jest.mock('@zextras/carbonio-design-system', () => ({
	useSnackbar: (): jest.Mock => jest.fn()
}));
jest.mock('react-i18next', () => ({
	useTranslation: (): [jest.Mock] => [jest.fn((key, defaultValue) => defaultValue)]
}));

describe('useSessionTimeout - handleVisibilityChange', () => {
	let mockDateNow: jest.SpyInstance;
	let mockSetTimeout: jest.SpyInstance;
	let mockClearTimeout: jest.SpyInstance;

	beforeAll(() => {
		jest.useFakeTimers();
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	beforeEach(() => {
		jest.clearAllTimers();
		mockDateNow = jest.spyOn(Date, 'now');
		mockSetTimeout = jest.spyOn(global, 'setTimeout');
		mockClearTimeout = jest.spyOn(global, 'clearTimeout');
	});

	afterEach(() => {
		mockDateNow.mockRestore();
		mockSetTimeout.mockRestore();
		mockClearTimeout.mockRestore();
	});

	test('should recalculate timeouts when page becomes visible after being hidden', () => {
		const sessionLifetime = 5 * 60 * 1000;
		const startTime = 1000;
		mockDateNow.mockReturnValue(startTime);

		renderHook(() => useSessionTimeout(sessionLifetime));
		const initialTimeoutCalls = mockSetTimeout.mock.calls.length;

		mockDateNow.mockReturnValue(startTime + 1000);
		Object.defineProperty(document, 'hidden', { value: true, configurable: true });
		document.dispatchEvent(new Event('visibilitychange'));

		const wakeTime = startTime + 2 * 60 * 1000 + 1000;
		mockDateNow.mockReturnValue(wakeTime);
		Object.defineProperty(document, 'hidden', { value: false, configurable: true });
		document.dispatchEvent(new Event('visibilitychange'));

		expect(mockSetTimeout.mock.calls.length).toBeGreaterThan(initialTimeoutCalls);
		expect(mockClearTimeout).toHaveBeenCalled();
	});

	test('should not recalculate if page was never hidden', () => {
		const sessionLifetime = 5 * 60 * 1000;
		mockDateNow.mockReturnValue(1000);

		renderHook(() => useSessionTimeout(sessionLifetime));
		const initialTimeoutCalls = mockSetTimeout.mock.calls.length;

		Object.defineProperty(document, 'hidden', { value: false, configurable: true });
		document.dispatchEvent(new Event('visibilitychange'));

		expect(mockSetTimeout.mock.calls.length).toBe(initialTimeoutCalls);
	});
});
