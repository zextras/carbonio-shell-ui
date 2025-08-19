/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Duration, DurationUnit } from '../types/account';

/**
 * Parse a Duration string to milliseconds
 * Supports units: d (days), h (hours), m (minutes), s (seconds), ms (milliseconds)
 * If no unit is provided, defaults to seconds
 *
 * @param duration - Duration string like '10m', '3600s', '2h', '600000', '2d'
 * @returns Duration in milliseconds, or null if invalid
 */
export function parseDuration(duration?: Duration): number | null {
	if (!duration) {
		return null;
	}

	// Extract number and unit using regex
	const match = duration.match(/^(\d+)(ms|[dhms])?$/);

	if (!match) {
		return null;
	}

	const [, numberStr, unit] = match;
	const number = parseFloat(numberStr);

	// Return 0 for zero values (disables idle timeout)
	if (number === 0) {
		return null;
	}

	// Default to seconds if no unit provided
	if (!unit) {
		return Math.floor(number * 1000);
	}

	// Convert based on unit
	switch (unit as DurationUnit) {
		case 'ms':
			return Math.floor(number);
		case 's':
			return Math.floor(number * 1000);
		case 'm':
			return Math.floor(number * 60 * 1000);
		case 'h':
			return Math.floor(number * 60 * 60 * 1000);
		case 'd':
			return Math.floor(number * 24 * 60 * 60 * 1000);
		default:
			return null;
	}
}
