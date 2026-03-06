/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { noop } from 'lodash';
import { createHash } from 'node:crypto';

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
			const decoder = new TextDecoder();
			const dataString = decoder.decode(data);
			const alg = typeof algorithm === 'string' ? algorithm : algorithm.name;
			return Promise.resolve(createHash(alg).update(dataString).digest());
		}
	}
});
