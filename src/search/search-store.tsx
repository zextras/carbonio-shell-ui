import create from 'zustand';

type SearchState = {
	query?: string;
	module?: string;
	update: (module?: string, query?: string) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
	query: undefined,
	module: undefined,
	update: (module?: string, query?: string): void => set({ module, query })
}));
