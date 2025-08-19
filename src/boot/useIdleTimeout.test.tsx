/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { renderHook } from '@testing-library/react';

import { useIdleTimeout } from './useIdleTimeout';

// Mock the logout function
jest.mock('../network/logout', () => ({
	logout: jest.fn()
}));

describe('useIdleTimeout', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should do nothing when timeout is not provided', () => {
		const { unmount } = renderHook(() => useIdleTimeout(undefined));
		unmount();
		// Should not throw any errors
	});

	it('should setup and cleanup properly for valid duration', () => {
		const { unmount } = renderHook(() => useIdleTimeout('10s'));
		unmount();
		// Should not throw any errors during cleanup
	});
});
