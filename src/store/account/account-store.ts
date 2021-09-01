import create from 'zustand';
import { AccountState } from './types';
import { getInfo } from './get-info';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const useAccountStore = create<AccountState>((set, get) => ({
	account: undefined,
	version: '',
	settings: {
		prefs: {},
		attrs: {},
		props: []
	},
	context: {},
	setContext: (context: any): void => set({ context }),
	init: (): Promise<void> => getInfo()
}));
