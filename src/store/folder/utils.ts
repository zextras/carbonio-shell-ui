/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { sortBy } from 'lodash';
import { Folder, FolderView, LinkFolder, TreeNode } from '../../../types';
import { FOLDERS, ROOT_NAME } from '../../constants';

const hasId = (f: Folder | TreeNode<unknown>, id: string): boolean => f.id.split(':').includes(id);
const getOriginalId = (f: Folder): string => {
	const parts = f.id.split(':');
	return parts[1] ?? parts[0];
};
export const sortFolders = (f: Folder): string => {
	const id = getOriginalId(f);
	if (id === FOLDERS.TRASH) {
		return '~';
	}
	return parseInt(id, 10) < 17 ? `   ${id}` : f.name.toLowerCase();
};

export const isTrash = (f: Folder): boolean => hasId(f, FOLDERS.TRASH);

export const isRoot = (f: Folder): boolean =>
	f.id === FOLDERS.USER_ROOT || (f as LinkFolder).oname === ROOT_NAME;

export const folderViewFilter =
	(v: FolderView) =>
	(deep?: boolean) =>
	(f: Folder): boolean =>
		f.view === v || !deep || (typeof f.view === 'undefined' && !isRoot(f));

export const filterNodes = <T>(
	children: TreeNode<T>[],
	f: (deep?: boolean) => (i: TreeNode<T>) => boolean,
	sortFunction?: (i: TreeNode<T>) => number | string,
	deep?: boolean
): TreeNode<T>[] => {
	const childrenSorted = sortFunction ? sortBy(children, sortFunction) : children;
	return childrenSorted
		.filter(f(deep))
		.map((i) => ({ ...i, children: filterNodes<TreeNode<T>>(i.children, f, sortFunction, true) }));
};

type MapNodesOptions<T, U> = {
	mapFunction: (i: TreeNode<T>) => U;
	filterFunction: (deep?: boolean) => (i: TreeNode<T>) => boolean;
	recursionKey: keyof U;
	sortFunction: (i: TreeNode<T>) => number | string;
	deep: boolean;
};
export const mapNodes = <T, U>(
	children: TreeNode<T>[],
	{ mapFunction, filterFunction, recursionKey, sortFunction, deep }: MapNodesOptions<T, U>
): U[] =>
	sortBy(children, sortFunction).reduce((acc, folder) => {
		if (filterFunction(deep)(folder)) {
			acc.push({
				...mapFunction(folder),
				[recursionKey]: mapNodes<TreeNode<T>, U>(folder.children, {
					mapFunction,
					filterFunction,
					recursionKey,
					sortFunction,
					deep: true
				})
			});
		}
		return acc;
	}, [] as U[]);
