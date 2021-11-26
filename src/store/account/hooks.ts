import { get, join } from 'lodash';
import { useMemo } from 'react';
import { Account, AccountSettings, NotifyObject, Tag } from '../../../types';
import { useAccountStore } from './store';

export const useUserAccount = (): Account => useAccountStore((s) => s.account as Account);
export const useUserAccounts = (): Array<Account> => {
	const acct = useAccountStore((s) => s.account);
	return useMemo(() => (acct ? [acct as Account] : []), [acct]);
};
export const useUserSettings = (): AccountSettings => useAccountStore((s) => s.settings);
export const useUserSetting = <T = void>(...path: Array<string>): string | T =>
	useAccountStore((s) => get(s.settings, join(path)));
export const useTags = (): Array<Tag> => useAccountStore((s) => s.tags);

export const useNotify = (): NotifyObject => {
	const notify = useAccountStore((s) => s.context.notify?.[0] ?? {});
	console.log(notify);
	return notify;
};
export const useRefresh = (): NotifyObject => useAccountStore((s) => s.context.refresh ?? {});

export const getUserAccount = (): Account => useAccountStore.getState().account as Account;
export const getUserAccounts = (): Array<Account> => [
	useAccountStore.getState().account as Account
];
export const getUserSettings = (): AccountSettings => useAccountStore.getState().settings;
export const getUserSetting = <T = void>(...path: Array<string>): string | T =>
	get(useAccountStore.getState().settings, join(path));
export const getTags = (): Array<Tag> => useAccountStore.getState().tags;
