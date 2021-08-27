import { useAccountStore } from './account-store';
import { Account, AccountSettings, Tag } from './types';

export const useUserAccount = (): Account => useAccountStore((s) => s.account as Account);
export const useUserAccounts = (): Array<Account> =>
	useAccountStore((s) => (s.account ? [s.account as Account] : []));
export const useUserSettings = (): AccountSettings => useAccountStore((s) => s.settings);
export const useTags = (): Array<Tag> => useAccountStore((s) => s.tags);
