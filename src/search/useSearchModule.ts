/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSearchStore } from './search-store';

export const SEARCH_MODULE_KEY = 'search_module';

export const setSearchModule = (newModule: string): void => {
	sessionStorage.setItem(SEARCH_MODULE_KEY, newModule);
	useSearchStore.getState().updateModule(newModule);
};
export const useSearchModule = (): [
	module: string | undefined,
	setModule: (module: string) => void
] => {
	const { module } = useSearchStore();

	return [module ?? sessionStorage.getItem(SEARCH_MODULE_KEY) ?? undefined, setSearchModule];
};
