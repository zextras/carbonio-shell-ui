/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import '@testing-library/jest-dom/vitest';
import { act, configure } from '@testing-library/react';
import dotenv from 'dotenv';
import { forEach, noop } from 'lodash';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';

import server from './mocks/server';
import type * as ReportingFunctions from './reporting/functions';

// this can be removed once migrated to Node 22 (https://github.com/wojtekmaj/react-pdf/wiki/Upgrade-guide-from-version-8.x-to-9.x#dropped-support-for-older-browsers-and-nodejs-versions)
import 'core-js/proposals/promise-with-resolvers';

dotenv.config();

const map: Record<
	Parameters<typeof window.addEventListener>[0],
	Parameters<typeof window.addEventListener>[1]
> = {};

configure({
	asyncUtilTimeout: 2000
});

// Configure fake timers globally
vi.useFakeTimers();

beforeEach(() => {
	// Mock console methods to fail tests on console errors/warnings
	const originalConsoleError = console.error;
	const originalConsoleWarn = console.warn;
	
	vi.spyOn(console, 'error').mockImplementation((errorMessage, ...args) => {
		// Allow controlled errors and some specific known messages
		const messageStr = typeof errorMessage === 'string' ? errorMessage : errorMessage?.message || '';
		
		if (
			messageStr.includes('Warning: ReactDOM.render is deprecated') ||
			messageStr.includes('Warning: componentWillReceiveProps has been renamed') ||
			messageStr.includes('Warning: componentWillMount has been renamed') ||
			messageStr.includes('act(...) is not supported in production builds') ||
			messageStr.includes('Controlled error')
		) {
			// Allow these specific warnings/errors
			originalConsoleError(errorMessage, ...args);
			return;
		}
		
		// Fail the test for unexpected console errors
		throw new Error(`Unexpected console.error: ${messageStr}`);
	});
	
	vi.spyOn(console, 'warn').mockImplementation((warnMessage, ...args) => {
		const messageStr = typeof warnMessage === 'string' ? warnMessage : warnMessage?.message || '';
		
		if (
			messageStr.includes('ReactDOM.render is deprecated') ||
			messageStr.includes('componentWillReceiveProps has been renamed') ||
			messageStr.includes('componentWillMount has been renamed')
		) {
			// Allow these specific warnings
			originalConsoleWarn(warnMessage, ...args);
			return;
		}
		
		// Fail the test for unexpected console warnings
		throw new Error(`Unexpected console.warn: ${messageStr}`);
	});

	// cleanup local storage
	window.localStorage.clear();

	vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1024);
	vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(768);
});

beforeAll(() => {
	server.listen({ onUnhandledRequest: 'warn' });

	const retryTimes = process.env.VITEST_RETRY_TIMES ? parseInt(process.env.VITEST_RETRY_TIMES, 10) : 2;
	// Note: Vitest handles retries differently, this would need to be configured in vitest.config.ts

	const originalAddEventListener = window.addEventListener;
	window.addEventListener = (...args: Parameters<typeof window.addEventListener>): void => {
		const [type, handler] = args;
		originalAddEventListener(...args);
		map[type] = handler;
	};
});

afterAll(() => {
	server.close();
});

afterEach(() => {
	act(() => {
		vi.runOnlyPendingTimers();
	});
	server.events.removeAllListeners();
	server.resetHandlers();
	act(() => {
		window.resizeTo(1024, 768);
	});

	forEach(map, (listener, event) => {
		window.removeEventListener(event, listener);
	});
});

// https://vitest.dev/guide/mocking.html#mocking-modules
vi.mock<typeof ReportingFunctions>('./reporting/functions');