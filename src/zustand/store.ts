import create from 'zustand';
import { produce } from 'immer';
import { ShellState } from './store-types';

export const useStore = create<ShellState>((set) => ({
	shares: {
		functions: {}
	},
	search: {
		simple: {},
		advanced: {}
	},
	addSimpleSearch: (app) => (types, UiComponent, searchRequestParams): void => {
		set(
			produce((state) => {
				state.search.simple[app] = {
					types,
					UiComponent,
					searchRequestParams
				};
			})
		);
	},
	addCustomSimpleSearch: (app) => (customSearch, UiComponent): void => {
		set(
			produce((state) => {
				state.search.simple[app] = {
					customSearch,
					UiComponent
				};
			})
		);
	},
	addSharedFunction: (app) => (id, fn): void =>
		set(
			produce((state) => {
				state.shares.functions[id] = {
					id,
					app,
					function: fn
				};
			})
		),
	removeSharedFunction: (app) => (id): void =>
		set(
			produce((state) => {
				if (state.shares.functions?.[id]?.app === app) {
					delete state.shares.functions[id];
				}
			})
		)
}));
