/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { QueryChip } from './items';

export * from './items';
export type SearchState = {
	query: Array<QueryChip>;
	module?: string;
	searchDisabled: boolean;
	setSearchDisabled: (searchDisabled: boolean) => void;
	updateQuery: (query: Array<QueryChip> | ((q: Array<QueryChip>) => Array<QueryChip>)) => void;
	updateModule: (module: string) => void;
};

export enum ResultLabelType {
	NORMAL = 'normal',
	WARNING = 'warning',
	ERROR = 'error'
}

// export type SelectLabelFactoryProps = {
// 	selected: [{ label: string; value: string }];
// 	open: boolean;
// 	focus: boolean;
// 	disabled: boolean;
// };
