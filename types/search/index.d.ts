/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export type QueryChip = {
	label: string;
	value?: string;
	isGeneric?: boolean;
	isQueryFilter?: boolean;
	hasAvatar?: boolean;
	app?: string;
};

export type SearchState = {
	query: Array<QueryChip>;
	module?: string;
	searchDisabled: boolean;
	setSearchDisabled: (searchDisabled: boolean) => void;
	updateQuery: (query: Array<QueryChip> | ((q: Array<QueryChip>) => Array<QueryChip>)) => void;
	updateModule: (module: string) => void;
};

export type SearchBarProps = {
	currentApp: string;
	primaryAction: unknown;
	secondaryActions: unknown;
};

export type SelectLabelFactoryProps = {
	selected: [{ label: string; value: string }];
	open: boolean;
	focus: boolean;
	disabled: boolean;
};
