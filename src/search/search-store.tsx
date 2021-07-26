import create from 'zustand';

type SearchState = {
	query?: string;
	module?: string;
	addQueryChip?: (value: string) => void;
	update: (module?: string, query?: string) => void;
	setAddQueryChip: (fn: (value: string) => void) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
	setAddQueryChip: (fn: (value: string) => void): void => set({ addQueryChip: fn }),
	update: (module?: string, query?: string): void => set({ module, query })
}));
