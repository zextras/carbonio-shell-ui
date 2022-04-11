/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { sortBy } from 'lodash';
import { Folder, FolderView, LinkFolder, TreeNode } from '../../../types';
import { FOLDERS, ROOT_NAME } from '../../constants';

const hasId = (f: Folder, id: string): boolean => f.id.split(':').includes(id);
const getOriginalId = (f: Folder): string => {
	const parts = f.id.split(':');
	return parts[1] ?? parts[0];
};
export const sortFolders = (f: Folder): string => {
	const id = getOriginalId(f);
	if (id === FOLDERS.TRASH) {
		return '~';
	}
	// should work fine
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return id < 17 ? id : f.name.toLowerCase();
};

export const isTrash = (f: Folder): boolean => hasId(f, FOLDERS.TRASH);

export const isRoot = (f: Folder): boolean =>
	f.id === FOLDERS.USER_ROOT || (f as LinkFolder).oname === ROOT_NAME;

export const folderViewFilter =
	(v: FolderView) =>
	(f: Folder, r?: boolean): boolean =>
		f.view === v || isTrash(f) || (isRoot(f) && !r);

export const filterNodes = <T>(
	children: TreeNode<T>[],
	f: (i: TreeNode<T>) => boolean
): TreeNode<T>[] =>
	children.filter(f).map((i) => ({ ...i, children: filterNodes<TreeNode<T>>(i.children, f) }));

type MapNodesOptions<T, U> = {
	mapFunction: (i: TreeNode<T>) => U;
	filterFunction: (i: TreeNode<T>, inRecursion?: boolean) => boolean;
	recursionKey: keyof U;
	sortFunction: (i: TreeNode<T>) => number | string;
};
export const mapNodes = <T, U>(
	children: TreeNode<T>[],
	{ mapFunction, filterFunction, recursionKey, sortFunction }: MapNodesOptions<T, U>,
	inRecursion?: boolean
): U[] =>
	sortBy(children, sortFunction).reduce((acc, folder) => {
		if (filterFunction(folder, inRecursion)) {
			acc.push({
				...mapFunction(folder),
				[recursionKey]: mapNodes<TreeNode<T>, U>(
					folder.children,
					{
						mapFunction,
						filterFunction,
						recursionKey,
						sortFunction
					},
					true
				)
			});
		}
		return acc;
	}, [] as U[]);
