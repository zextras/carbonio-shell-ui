/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { parseDuration } from './parseDuration';

describe('parseDuration', () => {
	it('should parse milliseconds correctly', () => {
		expect(parseDuration('500ms')).toBe(500);
	});

	it('should parse seconds correctly', () => {
		expect(parseDuration('1000')).toBe(1000000);
		expect(parseDuration('30s')).toBe(30000);
		expect(parseDuration('3600s')).toBe(3600000);
	});

	it('should parse minutes correctly', () => {
		expect(parseDuration('10m')).toBe(600000);
		expect(parseDuration('1m')).toBe(60000);
	});

	it('should parse hours correctly', () => {
		expect(parseDuration('2h')).toBe(7200000);
		expect(parseDuration('1h')).toBe(3600000);
	});

	it('should parse days correctly', () => {
		expect(parseDuration('1d')).toBe(86400000);
		expect(parseDuration('2d')).toBe(172800000);
	});

	it('should return null for invalid inputs', () => {
		expect(parseDuration(undefined)).toBeNull();
		expect(parseDuration('-10m')).toBeNull();
	});

	it('should handle decimal numbers', () => {
		expect(parseDuration('1.5h')).toBe(5400000);
		expect(parseDuration('2.5m')).toBe(150000);
	});
});
