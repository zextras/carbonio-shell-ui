/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import dotenv from 'dotenv';
import { forEach, noop } from 'lodash';
import failOnConsole from 'vitest-fail-on-console';

import server from './mocks/server';

dotenv.config({ quiet: true });

// Fake timers are enabled globally via beforeAll below

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
		/Controlled error/gi.test(errorMessage) ||
		// "An update to X inside a test was not wrapped in act(...)" warnings triggered by
		// third-party libraries (design system resize handler, zustand store updates in Breadcrumbs)
		// firing state updates outside of act() due to shouldAdvanceTime in fake timers
		/inside a test was not wrapped in act/i.test(errorMessage)
});

beforeEach(() => {
	Object.defineProperty(window, 'IntersectionObserver', {
		writable: true,
		value: vi.fn(function intersectionObserverMock(
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

	vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1024);
	vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(768);
});

beforeAll(() => {
	server.listen({ onUnhandledRequest: 'warn' });

	// Enable fake timers globally (equivalent to Jest's enableGlobally: true)
	vi.useFakeTimers({
		shouldAdvanceTime: true,
		toFake: [
			'setTimeout',
			'clearTimeout',
			'setInterval',
			'clearInterval',
			'Date',
			'requestAnimationFrame',
			'cancelAnimationFrame',
			'requestIdleCallback',
			'cancelIdleCallback',
			'performance'
		],
		advanceTimeDelta: 20
	});

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
	vi.clearAllTimers();
	server.events.removeAllListeners();
	server.resetHandlers();
	window.resizeTo(1024, 768);

	forEach(map, (listener, event) => {
		window.removeEventListener(event, listener);
	});
});

vi.mock('zustand');

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual<Record<string, unknown>>('react-router-dom');
	return {
		...actual,
		useBlocker: vi.fn().mockReturnValue({
			state: 'unblocked',
			proceed: vi.fn(),
			reset: vi.fn()
		})
	};
});

vi.mock('@zextras/carbonio-ui-preview', () => ({
	__esModule: true,
	PreviewManager: ({ children }: React.PropsWithChildren): React.ReactNode => children
}));

vi.mock('posthog-js/react');

vi.mock('darkreader');
