/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ComponentType, useMemo } from 'react';
import {
	Folders,
	LinkFolder,
	Searches,
	SearchFolder,
	Folder,
	AccordionFolder,
	TreeNode
} from '../../../types';
import { FOLDERS, ROOT_NAME } from '../../constants';
import { useFolderStore } from './store';

// FOLDERS
export const useFolder = (id: string): Folder | undefined =>
	useFolderStore((s) => (s.folders ? s.folders[id] : undefined));
export const getFolder = (id: string): Folder | undefined => {
	const folders = useFolderStore.getState();
	return folders.folders ? folders.folders[id] : undefined;
};
export const useFolders = (): Folders => useFolderStore((s) => s.folders) ?? {};
export const getFolders = (): Folders => useFolderStore.getState().folders ?? {};

// ROOTS
export const useRoot = (id: string): Folder | Record<string, never> =>
	useFolderStore((s) => (s.roots ? s.roots[id] : {}));
export const getRoot = (id: string): Folder | Record<string, never> => {
	const folders = useFolderStore.getState();
	return folders.roots ? folders.roots[id] : {};
};
export const useRoots = (): Folders => useFolderStore((s) => s.roots) ?? {};
export const getRoots = (): Folders => useFolderStore.getState().roots ?? {};

// ROOTS BY VIEW
export const useRootByView = (view: string): Folder | SearchFolder | Record<string, never> =>
	useFolderStore((s) => (s.roots ? s.roots[view] : {}));
export const getRootByView = (view: string): Folder | SearchFolder | Record<string, never> => {
	const folders = useFolderStore.getState();
	return folders.roots ? folders.roots[view] : {};
};
export const useRootsByView = (view: string): Folders => useFolderStore((s) => s.roots) ?? {};
export const getRootsByView = (view: string): Folders => useFolderStore.getState().folders ?? {};

// SEARCHES

export const useSearch = (id: string): SearchFolder | Record<string, never> =>
	useFolderStore((s) => (s.searches ? s.searches[id] : {}));
export const getSearch = (id: string): SearchFolder | Record<string, never> => {
	const searches = useFolderStore.getState();
	return searches.searches ? searches.searches[id] : {};
};
export const useSearches = (): Searches => useFolderStore((s) => s.searches) ?? {};
export const getSearches = (): Searches => useFolderStore.getState().searches ?? {};

// Accordion-ize

const filterNodes = <T>(children: TreeNode<T>[], f: (i: TreeNode<T>) => boolean): TreeNode<T>[] =>
	children.filter(f).map((i) => ({ ...i, children: filterNodes<TreeNode<T>>(i.children, f) }));

const mapNodes = <T, U>(
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

export const useFoldersByView = (view: string): Folder => {
	const root = useFolder(FOLDERS.USER_ROOT);
	const filtered = useMemo(
		() =>
			root ? filterNodes<Folder>([root], (f) => f.view === view || f.id === FOLDERS.TRASH) : [],
		[root, view]
	);
	return filtered[0];
};

const isRoot = (f: Folder): boolean =>
	f.id === FOLDERS.ROOT || (f as LinkFolder).oname === ROOT_NAME;

export const useFoldersAccordionByView = (
	view: string,
	customComponent: ComponentType<{ folder: Folder }>
): AccordionFolder => {
	const root = useFolder(FOLDERS.USER_ROOT);
	const mapped = useMemo(
		() =>
			root
				? mapNodes<Folder, AccordionFolder>(
						[root],
						(f) => ({
							id: f.id,
							label: f.name,
							customComponent,
							items: [],
							folder: f
						}),
						(f) => f.view === view || f.id === FOLDERS.TRASH || isRoot(f),
						'items'
				  )
				: [],
		[customComponent, root, view]
	);
	return mapped[0];
};
