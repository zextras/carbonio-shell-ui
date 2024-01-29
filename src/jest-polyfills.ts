/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { noop } from 'lodash';
import { TextEncoder, TextDecoder } from 'node:util';

// Define browser objects not available in jest
// https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom

// If it's necessary to use a jest mock,
// place the definition in the beforeEach,
// because the restoreMock config restore all mocks to the initial value
// (undefined if the object is not present at all)

/**
 * @note The block below contains polyfills for Node.js globals
 * required for Jest to function when running JSDOM tests.
 * These HAVE to be "require" and HAVE to be in this exact
 * order, since "undici" depends on the "TextEncoder" global API.
 *
 * Consider migrating to a more modern test runner if
 * you don't want to deal with this.
 *
 * @see https://mswjs.io/docs/migrations/1.x-to-2.x#requestresponsetextencoder-is-not-defined-jest
 */

Object.defineProperties(global, {
	TextEncoder: { value: TextEncoder },
	TextDecoder: { value: TextDecoder }
});

// undici requires TextDecoder to be defined,
// so import must occur after the definition of TextDecoder
// Make sure to have undici@5 to make fetch work (see https://github.com/mswjs/msw/issues/1931)
// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
const { fetch, Headers, FormData, Request, Response } = require('undici');

Object.defineProperties(global, {
	fetch: { value: fetch, writable: true },
	Blob: { value: Blob },
	File: { value: File },
	Headers: { value: Headers },
	FormData: { value: FormData },
	Request: { value: Request },
	Response: { value: Response }
});

window.matchMedia = function matchMedia(query: string): MediaQueryList {
	return {
		matches: false,
		media: query,
		onchange: null,
		addListener: noop, // Deprecated
		removeListener: noop, // Deprecated
		addEventListener: noop,
		removeEventListener: noop,
		dispatchEvent: () => true
	};
};

Element.prototype.scrollIntoView = noop;

Element.prototype.scrollTo = noop;

window.resizeTo = function resizeTo(width, height): void {
	Object.assign(this, {
		innerWidth: width,
		innerHeight: height,
		outerWidth: width,
		outerHeight: height
	}).dispatchEvent(new this.Event('resize'));
};

Object.defineProperty(window, 'ResizeObserver', {
	writable: true,
	value: function ResizeObserverMock(): ResizeObserver {
		return {
			observe: noop,
			unobserve: noop,
			disconnect: noop
		};
	}
});
