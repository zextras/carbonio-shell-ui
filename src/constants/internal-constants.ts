/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export const SETTINGS_OUT_OF_OFFICE_TEXT_AREA_MAX_CHAR_LIMIT = 8192;
export const LOCAL_STORAGE_ENABLE_STRICT_MODE = 'enable_strict_mode';
/** Stores the secondary bar width (in rem), shared by all modules */
export const LOCAL_STORAGE_SECONDARY_BAR_WIDTH = 'secondary_bar_width';
/** Secondary bar widths, expressed in rem so they follow the scaling setting */
export const SECONDARY_BAR_WIDTH = {
	/** Icons-only width */
	collapsed: 3.25,
	/** Dragging below this width collapses the bar to the icons-only width */
	collapseThreshold: 10,
	min: 15,
	default: 20,
	max: 30
} as const;
