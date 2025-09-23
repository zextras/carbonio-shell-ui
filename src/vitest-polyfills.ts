/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { noop } from 'lodash';
import { createHash } from 'node:crypto';
import { vi } from 'vitest';

// Import the environment setup
import './vitest-env-setup';

// Mock CSS modules
vi.mock('*.css', () => ({}));
vi.mock('*.module.css', () => ({}));
vi.mock('*.less', () => ({}));
vi.mock('*.scss', () => ({}));
vi.mock('*.sass', () => ({}));

// Define browser objects not available in vitest
// https://vitest.dev/guide/environment.html#jsdom-environment

// If it's necessary to use a vitest mock,
// place the definition in the beforeEach,
// because the restoreMock config restore all mocks to the initial value
// (undefined if the object is not present at all)

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

Object.defineProperty(window.crypto, 'subtle', {
	writable: true,
	value: {
		digest(algorithm: AlgorithmIdentifier, data: BufferSource): Promise<Buffer> {
			return new Promise((resolve) => {
				const decoder = new TextDecoder();
				const dataString = decoder.decode(data);
				const alg = typeof algorithm === 'string' ? algorithm : algorithm.name;
				setTimeout(() => resolve(createHash(alg).update(dataString).digest()), 0);
			});
		}
	}
});

Object.defineProperty(window.crypto, 'randomUUID', {
	writable: true,
	value: vi.fn(() => Math.random().toString())
});