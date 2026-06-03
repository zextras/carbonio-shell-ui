/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { parseDuration } from './parseDuration';

describe('parseDuration', () => {
	it('should parse milliseconds correctly', () => {
		expect(parseDuration('500ms'), '"500ms" should parse to 500 milliseconds').toBe(500);
	});

	it('should parse seconds correctly', () => {
		expect(
			parseDuration('1000'),
			'a bare number should be treated as seconds, so "1000" is 1000000 milliseconds'
		).toBe(1000000);
		expect(parseDuration('30s'), '"30s" should parse to 30000 milliseconds').toBe(30000);
		expect(parseDuration('3600s'), '"3600s" should parse to 3600000 milliseconds').toBe(3600000);
	});

	it('should parse minutes correctly', () => {
		expect(parseDuration('10m'), '"10m" should parse to 600000 milliseconds').toBe(600000);
		expect(parseDuration('1m'), '"1m" should parse to 60000 milliseconds').toBe(60000);
	});

	it('should parse hours correctly', () => {
		expect(parseDuration('2h'), '"2h" should parse to 7200000 milliseconds').toBe(7200000);
		expect(parseDuration('1h'), '"1h" should parse to 3600000 milliseconds').toBe(3600000);
	});

	it('should parse days correctly', () => {
		expect(parseDuration('1d'), '"1d" should parse to 86400000 milliseconds').toBe(86400000);
		expect(parseDuration('2d'), '"2d" should parse to 172800000 milliseconds').toBe(172800000);
	});

	it('should return null for invalid inputs', () => {
		expect(parseDuration(undefined), 'undefined input should return null').toBeNull();
		expect(parseDuration('-10m'), 'a negative duration "-10m" should return null').toBeNull();
	});

	it('should return null for decimal numbers', () => {
		expect(parseDuration('1.5h'), 'a decimal duration "1.5h" should return null').toBe(null);
		expect(parseDuration('2.5m'), 'a decimal duration "2.5m" should return null').toBe(null);
	});

	it('should return null for zero values (disables idle timeout)', () => {
		expect(
			parseDuration('0'),
			'a zero duration "0" should return null to disable the timeout'
		).toBeNull();
		expect(
			parseDuration('0s'),
			'a zero duration "0s" should return null to disable the timeout'
		).toBeNull();
		expect(
			parseDuration('0m'),
			'a zero duration "0m" should return null to disable the timeout'
		).toBeNull();
		expect(
			parseDuration('0h'),
			'a zero duration "0h" should return null to disable the timeout'
		).toBeNull();
		expect(
			parseDuration('0d'),
			'a zero duration "0d" should return null to disable the timeout'
		).toBeNull();
		expect(
			parseDuration('0ms'),
			'a zero duration "0ms" should return null to disable the timeout'
		).toBeNull();
	});

	it('should return null for invalid format', () => {
		expect(
			parseDuration(' 10m'),
			'a duration with a leading space " 10m" should return null'
		).toBeNull();
	});

	it('should return null for negative numbers', () => {
		expect(parseDuration('-1s'), 'a negative duration "-1s" should return null').toBeNull();
		expect(parseDuration('-10'), 'a negative bare number "-10" should return null').toBeNull();
		expect(parseDuration('-5m'), 'a negative duration "-5m" should return null').toBeNull();
	});
});
