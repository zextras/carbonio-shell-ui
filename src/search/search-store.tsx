/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isFunction } from 'lodash';
import create from 'zustand';
import { QueryChip, SearchState } from '../../types';

export const useSearchStore = create<SearchState>((set, get) => ({
	query: [],
	updateQuery: (query: Array<QueryChip> | ((q: Array<QueryChip>) => Array<QueryChip>)): void =>
		set({ query: isFunction(query) ? query(get().query) : query }),
	updateModule: (module: string): void => set({ module })
}));
