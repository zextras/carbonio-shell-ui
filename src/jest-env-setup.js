/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// import '@testing-library/jest-dom/extend-expect';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

Object.defineProperty(global.self, 'crypto', {
	value: {
		getRandomValues: (arr) => crypto.randomBytes(arr.length)
	}
});
