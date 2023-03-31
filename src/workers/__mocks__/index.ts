/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { noop } from 'lodash';

export const tagWorker: Worker = {
	postMessage: noop,
	onmessage: noop,
	onmessageerror: noop,
	onerror: noop,
	terminate: noop,
	addEventListener: noop,
	removeEventListener: noop,
	dispatchEvent: () => false
};

export const folderWorker: Worker = {
	postMessage: noop,
	onmessage: noop,
	onmessageerror: noop,
	onerror: noop,
	terminate: noop,
	addEventListener: noop,
	removeEventListener: noop,
	dispatchEvent: () => false
};
