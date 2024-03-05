/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DropdownItem } from '@zextras/carbonio-design-system';

export type Action = DropdownItem & {
	primary?: boolean;
	group?: string;
	/** @deprecated use onClick instead */
	click?: DropdownItem['onClick'];
};

export type ActionFactory<T> = (target: T) => Action;
export type CombinedActionFactory<T> = (target: T) => Array<Action>;
