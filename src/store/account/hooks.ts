import { Account, AccountSettings, NotifyObject, Tag } from '../../../types';
import { useAccountStore } from './store';

export const useUserAccount = (): Account => useAccountStore((s) => s.account as Account);
export const useUserAccounts = (): Array<Account> =>
	useAccountStore((s) => (s.account ? [s.account as Account] : []));
export const useUserSettings = (): AccountSettings => useAccountStore((s) => s.settings);
export const useTags = (): Array<Tag> => useAccountStore((s) => s.tags);

export const useNotify = (): NotifyObject => useAccountStore((s) => s.context.notify?.[0] ?? {});
export const useRefresh = (): NotifyObject => useAccountStore((s) => s.context.refresh ?? {});

export const getUserAccount = (): Account => useAccountStore.getState().account as Account;
export const getUserAccounts = (): Array<Account> => [
	useAccountStore.getState().account as Account
];
export const getUserSettings = (): AccountSettings => useAccountStore.getState().settings;
export const getTags = (): Array<Tag> => useAccountStore.getState().tags;
