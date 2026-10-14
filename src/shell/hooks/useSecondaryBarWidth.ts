/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useCallback, useMemo } from 'react';

import { round } from 'lodash';

import { useLocalStorage } from './useLocalStorage';
import {
	LOCAL_STORAGE_SECONDARY_BAR_WIDTH,
	SECONDARY_BAR_WIDTH
} from '../../constants/internal-constants';

/**
 * Return the width (in rem) the secondary bar takes for the requested width:
 * under the collapse threshold the bar collapses to its icons-only width,
 * otherwise the width is kept between the min and the max
 */
export function snapSecondaryBarWidth(widthInRem: number): number {
	if (widthInRem < SECONDARY_BAR_WIDTH.collapseThreshold) {
		return SECONDARY_BAR_WIDTH.collapsed;
	}
	return Math.min(Math.max(widthInRem, SECONDARY_BAR_WIDTH.min), SECONDARY_BAR_WIDTH.max);
}

/**
 * Return a valid width (in rem) from a stored value, falling back to the default width
 * when the value is missing or invalid
 */
export function normalizeSecondaryBarWidth(value: unknown): number {
	if (typeof value !== 'number' || !Number.isFinite(value)) {
		return SECONDARY_BAR_WIDTH.default;
	}
	return snapSecondaryBarWidth(value);
}

/**
 * Return whether the given width (in rem) is the icons-only width
 */
export function isSecondaryBarCollapsed(widthInRem: number): boolean {
	return widthInRem === SECONDARY_BAR_WIDTH.collapsed;
}

/**
 * Read and save, in the local storage, the secondary bar width (in rem).
 * The value is per device and shared by all modules.
 */
export const useSecondaryBarWidth = (): [
	width: number,
	saveWidth: (widthInRem: number) => void
] => {
	const [savedWidth, setSavedWidth] = useLocalStorage<unknown>(
		LOCAL_STORAGE_SECONDARY_BAR_WIDTH,
		undefined
	);

	const width = useMemo(() => normalizeSecondaryBarWidth(savedWidth), [savedWidth]);

	const saveWidth = useCallback(
		(widthInRem: number) => {
			setSavedWidth(round(normalizeSecondaryBarWidth(widthInRem), 3));
		},
		[setSavedWidth]
	);

	return [width, saveWidth];
};
