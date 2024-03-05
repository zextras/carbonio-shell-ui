/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { ChipItem } from '@zextras/carbonio-design-system';

export type QueryItem = {
	value?: string;
	app?: string;
};

export type QueryChip = ChipItem & QueryItem;
