/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { Folder, LinkFolder, TreeNode } from '../../../types';
import { FOLDERS, ROOT_NAME } from '../../constants';

export const filterNodes = <T>(
	children: TreeNode<T>[],
	f: (i: TreeNode<T>) => boolean
): TreeNode<T>[] =>
	children.filter(f).map((i) => ({ ...i, children: filterNodes<TreeNode<T>>(i.children, f) }));

export const mapNodes = <T, U>(
	children: TreeNode<T>[],
	mapFunction: (i: TreeNode<T>) => U,
	filterFunction: (i: TreeNode<T>) => boolean,
	recursionKey: keyof U
): U[] =>
	children.reduce((acc, folder) => {
		if (filterFunction(folder)) {
			acc.push({
				...mapFunction(folder),
				[recursionKey]: mapNodes<TreeNode<T>, U>(
					folder.children,
					mapFunction,
					filterFunction,
					recursionKey
				)
			});
		}
		return acc;
	}, [] as U[]);

export const isRoot = (f: Folder): boolean =>
	f.id === FOLDERS.USER_ROOT || (f as LinkFolder).oname === ROOT_NAME;
