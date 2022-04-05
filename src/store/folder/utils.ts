/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { endsWith, sortBy } from 'lodash';
import { Folder, FolderView, LinkFolder, TreeNode } from '../../../types';
import { FOLDERS, ROOT_NAME } from '../../constants';

export const sortFolders = (f: Folder): string => {
	const id = f.id.split(':')?.[f.isLink ? 1 : 0];
	if (id === FOLDERS.TRASH) {
		return '~';
	}
	// should work fine
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return id < 17 ? id : f.name.toLowerCase();
};

export const isTrash = (f: Folder): boolean =>
	f.id === FOLDERS.TRASH || endsWith(f.id, FOLDERS.TRASH);

export const isRoot = (f: Folder): boolean =>
	f.id === FOLDERS.USER_ROOT || (f as LinkFolder).oname === ROOT_NAME;

export const folderViewFilter =
	(v: FolderView) =>
	(f: Folder): boolean =>
		f.view === v || isTrash(f) || isRoot(f);

export const filterNodes = <T>(
	children: TreeNode<T>[],
	f: (i: TreeNode<T>) => boolean
): TreeNode<T>[] =>
	children.filter(f).map((i) => ({ ...i, children: filterNodes<TreeNode<T>>(i.children, f) }));

type MapNodesOptions<T, U> = {
	mapFunction: (i: TreeNode<T>) => U;
	filterFunction: (i: TreeNode<T>) => boolean;
	recursionKey: keyof U;
	sortFunction: (i: TreeNode<T>) => number | string;
};
export const mapNodes = <T, U>(
	children: TreeNode<T>[],
	{ mapFunction, filterFunction, recursionKey, sortFunction }: MapNodesOptions<T, U>
): U[] =>
	sortBy(children, sortFunction).reduce((acc, folder) => {
		if (filterFunction(folder)) {
			acc.push({
				...mapFunction(folder),
				[recursionKey]: mapNodes<TreeNode<T>, U>(folder.children, {
					mapFunction,
					filterFunction,
					recursionKey,
					sortFunction
				})
			});
		}
		return acc;
	}, [] as U[]);
