/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
describe('jest-global-setup', () => {
	it('should always be UTC', () => {
		expect(new Date().getTimezoneOffset()).toBe(0);
	});
});
