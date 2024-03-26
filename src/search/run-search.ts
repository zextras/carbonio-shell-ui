/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useSearchStore } from './search-store';
import { SEARCH_APP_ID } from '../constants';
import { pushHistory } from '../history/hooks';
import type { QueryChip } from '../types/search';

export const runSearch = (query: Array<QueryChip>, module: string): void => {
	useSearchStore.setState({ query, module, searchDisabled: false });
	pushHistory({ route: SEARCH_APP_ID, path: `/${module}` });
};
