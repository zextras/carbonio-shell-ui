/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import 'whatwg-fetch';
import { noop } from 'lodash';

// define browser objects not available in jest
// https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
// if it's necessary to use a jest mock, place the definition in the beforeEach, because the restoreMock
// config restore all mocks to the initial value (undefined if the object is not present at all)

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
