import { isFunction } from 'lodash';
import create from 'zustand';

type SearchState = {
	query: Array<{ label: string } & unknown>;
	module?: string;
	updateQuery: (
		query:
			| Array<{ label: string } & unknown>
			| ((q: Array<{ label: string } & unknown>) => Array<{ label: string } & unknown>)
	) => void;
	updateModule: (module: string) => void;
};

export const useSearchStore = create<SearchState>((set, get) => ({
	query: [],
	updateQuery: (
		query:
			| Array<{ label: string } & unknown>
			| ((q: Array<{ label: string } & unknown>) => Array<{ label: string } & unknown>)
	): void => set({ query: isFunction(query) ? query(get().query) : query }),
	updateModule: (module: string): void => set({ module })
}));
