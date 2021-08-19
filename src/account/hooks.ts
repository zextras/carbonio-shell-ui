import { useAccountStore } from './account-store';
import { Account, AccountSettings } from './types';

export const useUserAccount = (): Account => useAccountStore((s) => s.accounts?.[0]);
export const useUserAccounts = (): Array<Account> => useAccountStore((s) => s.accounts);
export const useUserSettings = (): AccountSettings =>
	useAccountStore((s) => s.accounts?.[0]?.settings);
