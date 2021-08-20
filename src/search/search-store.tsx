import { isFunction } from 'lodash';
import create from 'zustand';

export type QueryChip = {
	label: string;
	value?: string;
	isGeneric?: boolean;
	isQueryFilter?: boolean;
	hasAvatar?: boolean;
};

type SearchState = {
	query: Array<QueryChip>;
	module?: string;
	updateQuery: (query: Array<QueryChip> | ((q: Array<QueryChip>) => Array<QueryChip>)) => void;
	updateModule: (module: string) => void;
};

export const useSearchStore = create<SearchState>((set, get) => ({
	query: [],
	updateQuery: (query: Array<QueryChip> | ((q: Array<QueryChip>) => Array<QueryChip>)): void =>
		set({ query: isFunction(query) ? query(get().query) : query }),
	updateModule: (module: string): void => set({ module })
}));
