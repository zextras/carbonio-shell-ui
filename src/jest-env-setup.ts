/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import '@testing-library/jest-dom';
import { act, configure } from '@testing-library/react';
import dotenv from 'dotenv';
import failOnConsole from 'jest-fail-on-console';
import { forEach, noop } from 'lodash';

import server from './mocks/server';
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

failOnConsole({
	shouldFailOnWarn: true,
	shouldFailOnError: true,
	silenceMessage: (errorMessage) =>
		// Warning: Failed prop type: Invalid prop `target` of type `Window` supplied to `ForwardRef(SnackbarFn)`, expected instance of `Window`
		// This warning is printed in the console for this render. This happens because window element is a jsdom representation of the window,
		// and it's an object instead of a Window class instance, so the check on the prop type fail for the target prop
		/Invalid prop `\w+`(\sof type `\w+`)? supplied to `(\w+(\(\w+\))?)`/.test(errorMessage) ||
		// errors forced from the tests
		/Controlled error/gi.test(errorMessage)
});

beforeEach(() => {
	Object.defineProperty(window, 'IntersectionObserver', {
		writable: true,
		value: jest.fn(function intersectionObserverMock(
			callback: IntersectionObserverCallback,
			options: IntersectionObserverInit
		) {
			return {
				thresholds: options.threshold,
				root: options.root,
				rootMargin: options.rootMargin,
				observe: noop,
				unobserve: noop,
				disconnect: noop
			};
		})
	});

	// cleanup local storage
	window.localStorage.clear();

	jest.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1024);
	jest.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(768);
});

beforeAll(() => {
	server.listen({ onUnhandledRequest: 'warn' });

	const retryTimes = process.env.JEST_RETRY_TIMES ? parseInt(process.env.JEST_RETRY_TIMES, 10) : 2;
	jest.retryTimes(retryTimes, { logErrorsBeforeRetry: true });

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
		jest.runOnlyPendingTimers();
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

// https://jestjs.io/docs/manual-mocks#mocking-user-modules
// disable eslint since these imports are made only to have a direct evidence of the path
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock<typeof import('./workers')>('./workers');
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock<typeof import('./reporting/functions')>('./reporting/functions');
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
jest.mock<typeof import('./reporting/store')>('./reporting/store');
