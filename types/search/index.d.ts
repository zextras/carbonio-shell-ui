export type QueryChip = {
	label: string;
	value?: string;
	isGeneric?: boolean;
	isQueryFilter?: boolean;
	hasAvatar?: boolean;
};

export type SearchState = {
	query: Array<QueryChip>;
	module?: string;
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
};
