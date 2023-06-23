/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isFunction } from 'lodash';
import { create } from 'zustand';

import type { QueryChip, SearchState } from '../../types';

// extra currying as suggested in https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#basic-usage
export const useSearchStore = create<SearchState>()((set, get) => ({
	query: [],
	searchDisabled: false,
	tooltip: undefined,
	setSearchDisabled: (searchDisabled: boolean, tooltip?: string): void =>
		set({ searchDisabled, tooltip }),
	updateQuery: (query: Array<QueryChip> | ((q: Array<QueryChip>) => Array<QueryChip>)): void =>
		set({ query: isFunction(query) ? query(get().query) : query }),
	updateModule: (module: string): void => set({ module })
}));
