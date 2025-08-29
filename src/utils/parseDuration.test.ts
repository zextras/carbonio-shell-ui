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

	it('should return null for decimal numbers', () => {
		expect(parseDuration('1.5h')).toBe(null);
		expect(parseDuration('2.5m')).toBe(null);
	});

	it('should return null for zero values (disables idle timeout)', () => {
		expect(parseDuration('0')).toBeNull();
		expect(parseDuration('0s')).toBeNull();
		expect(parseDuration('0m')).toBeNull();
		expect(parseDuration('0h')).toBeNull();
		expect(parseDuration('0d')).toBeNull();
		expect(parseDuration('0ms')).toBeNull();
	});

	it('should return null for invalid format', () => {
		expect(parseDuration(' 10m')).toBeNull();
	});

	it('should return null for negative numbers', () => {
		expect(parseDuration('-1s')).toBeNull();
		expect(parseDuration('-10')).toBeNull();
		expect(parseDuration('-5m')).toBeNull();
	});
});
