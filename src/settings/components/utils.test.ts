/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { dateToGenTime, genTimeToDate } from './utils';

describe('dateToGenTime function', () => {
	it('should return a UTC date with the format YYYYMMDDHHmmss[Z]', () => {
		const date = new Date(2024, 4, 20, 15, 22, 45);
		expect(dateToGenTime(date)).toBe('20240520152245Z');
	});
});

describe('genTimeToDate function', () => {
	it('should return a date starting from a valid string with format YYYYMMDDHHmmss[Z]', () => {
		const dateStr = '20240520152245Z';
		expect(genTimeToDate(dateStr)).toEqual(new Date(2024, 4, 20, 15, 22, 45, 0));
	});
});
