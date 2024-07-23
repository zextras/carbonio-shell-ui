/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { dateToGenTime, genTimeToDate, humanFileSize } from './utils';
import type { GeneralizedTime } from '../../types/account';

describe('dateToGenTime function', () => {
	it('should return a UTC date with the format YYYYMMDDHHmmss[Z]', () => {
		const date = new Date(2024, 4, 20, 15, 22, 45, 0);
		const offset = date.getTimezoneOffset();
		const dateUTC = new Date(date.getTime() - offset * 60 * 1000);
		expect(dateToGenTime(dateUTC)).toBe('20240520152245Z');
	});
});

describe('genTimeToDate function', () => {
	it('should return a date starting from a valid string with format YYYYMMDDHHmmss[Z]', () => {
		const dateStr = '20240520152245Z' as GeneralizedTime;
		const date = new Date(2024, 4, 20, 15, 22, 45, 0);
		const offset = date.getTimezoneOffset();
		const dateUTC = new Date(date.getTime() - offset * 60 * 1000);
		expect(genTimeToDate(dateStr)).toEqual(dateUTC);
	});

	it('should return a date starting from a valid string with format YYYYMMDDHHmmss.SSS[Z]', () => {
		const dateStr = '20240520152245.123Z' as GeneralizedTime;
		const date = new Date(2024, 4, 20, 15, 22, 45, 0);
		const offset = date.getTimezoneOffset();
		const dateUTC = new Date(date.getTime() - offset * 60 * 1000);
		expect(genTimeToDate(dateStr)).toEqual(dateUTC);
	});
});

describe('humanFileSize function', () => {
	it('should return 0 B if input is 0', () => {
		const result = humanFileSize(0);
		expect(result).toBe('0 B');
	});

	it('should return x if input is max safe integer', () => {
		const result = humanFileSize(Number.MAX_SAFE_INTEGER);
		expect(result).toBe('8.00 PB');
	});

	it.each([
		['B', 0],
		['KB', 1],
		['MB', 2],
		['GB', 3],
		['TB', 4],
		['PB', 5],
		['EB', 6],
		['ZB', 7],
		['YB', 8]
	])('should return %s unit if input pow is %s', (unit, pow) => {
		const result = humanFileSize(1024 ** pow);
		expect(result).toBe(`1.00 ${unit}`);
	});

	it.each([
		['B', 1],
		['KB', 2],
		['MB', 3],
		['GB', 4],
		['TB', 5],
		['PB', 6],
		['EB', 7],
		['ZB', 8]
	])(
		'should return %s unit measure if input is one unit lower than the next unit measure',
		(unit, pow) => {
			const result = humanFileSize(1024 ** pow - 1024 ** (pow - 1));
			expect(result).toBe(`1023.00 ${unit}`);
		}
	);

	it('should change unit from KB to B when removing 1 B from 1024 B', () => {
		expect(humanFileSize(1024 - 1)).toBe('1023.00 B');
	});

	it.each([
		['KB', 2],
		['MB', 3],
		['GB', 4]
	])('should return 1024.00 %s if input is 1024 ** %s - 1', (unit, pow) => {
		const result = humanFileSize(1024 ** pow - 1);
		expect(result).toBe(`1024.00 ${unit}`);
	});

	it.each([
		['PB', 5],
		['EB', 6],
		['ZB', 7],
		['YB', 8]
	])('should return %s unit if input pow is %s - 1B', (unit, pow) => {
		const result = humanFileSize(1024 ** pow - 1);
		expect(result).toBe(`1.00 ${unit}`);
	});

	it('should throw an error if inputSize is equal or greater than 1024 YB', () => {
		expect(() => humanFileSize(1024 ** 9)).toThrow('Unsupported inputSize');
	});
});
