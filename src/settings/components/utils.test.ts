/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { dateToGenTime, genTimeToDate } from './utils';

describe('dateToGenTime function', () => {
	it('should return a UTC date with the format YYYYMMDDHHmmss[Z]', () => {
		const date = new Date(2024, 4, 20, 15, 22, 45);
		const offset = date.getTimezoneOffset();
		const dateUTC = new Date(date.getTime() - offset * 60 * 1000);
		expect(dateToGenTime(dateUTC)).toBe('20240520152245Z');
	});
});

describe('genTimeToDate function', () => {
	it('should return a date starting from a valid string with format YYYYMMDDHHmmss[Z]', () => {
		const dateStr = '20240520152245Z';
		const date = new Date(2024, 4, 20, 15, 22, 45, 0);
		const offset = date.getTimezoneOffset();
		const dateUTC = new Date(date.getTime() - offset * 60 * 1000);
		expect(genTimeToDate(dateStr)).toEqual(dateUTC);
	});
});
