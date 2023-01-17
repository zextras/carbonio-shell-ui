/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ComponentType, useMemo } from 'react';
import {
	Folders,
	Searches,
	SearchFolder,
	Folder,
	AccordionFolder,
	FolderView
} from '../../../types';
import { FOLDER_VIEW } from '../../constants';
import { useFolderStore } from './store';
import { filterNodes, folderViewFilter, isRoot, mapNodes, sortFolders } from './utils';

// FOLDERS
export const useFolder = (id: string): Folder | undefined => useFolderStore((s) => s.folders?.[id]);
export const getFolder = (id: string): Folder | undefined =>
	useFolderStore.getState()?.folders?.[id];
export const useFolders = (): Folders => useFolderStore((s) => s.folders);
export const getFolders = (): Folders => useFolderStore.getState().folders;

// ROOTS
export const useRoot = (id: string): Folder | undefined => useFolderStore((s) => s.roots?.[id]);
export const getRoot = (id: string): Folder | undefined => useFolderStore.getState().roots?.[id];
export const useRoots = (): Folders => useFolderStore((s) => s.roots);
export const getRoots = (): Folders => useFolderStore.getState().roots;

// ROOTS BY VIEW
export const useRootByUser = (userId: string): Folder | SearchFolder | Record<string, never> =>
	useFolderStore((s) => (s.roots ? s.roots[userId] : {}));
export const getRootByUser = (userId: string): Folder | SearchFolder | Record<string, never> => {
	const folders = useFolderStore.getState();
	return folders.roots ? folders.roots[userId] : {};
};

// SEARCHES

export const useSearchFolder = (id: string): SearchFolder | undefined =>
	useFolderStore((s) => s.searches?.[id]);
export const getSearchFolder = (id: string): SearchFolder | undefined =>
	useFolderStore.getState().searches[id];
export const useSearchFolders = (): Searches => useFolderStore((s) => s.searches);
export const getSearchFolders = (): Searches => useFolderStore.getState().searches;

// Accordion-ize

export const useFoldersByView = (view: FolderView): Array<Folder> => {
	const roots = useRoots();
	const sortFunction = useMemo(
		() => (view === FOLDER_VIEW.message ? sortFolders : undefined),
		[view]
	);
	return useMemo(
		() =>
			roots ? filterNodes<Folder>(Object.values(roots), folderViewFilter(view), sortFunction) : [],
		[roots, sortFunction, view]
	);
};

export const useFoldersAccordionByView = (
	view: FolderView,
	CustomComponent: ComponentType<{ folder: Folder }>,
	itemProps?: (item: AccordionFolder) => Record<string, any>
): Array<AccordionFolder> => {
	const roots = useRoots();
	return useMemo(
		() =>
			roots
				? mapNodes<Folder, AccordionFolder>(Object.values(roots), {
						mapFunction: (f) => {
							const item = {
								id: f.id,
								label: f.name,
								CustomComponent,
								items: [],
								folder: f,
								disableHover: isRoot(f)
							};
							const props = itemProps?.(item) ?? {};
							return { ...item, ...props };
						},
						filterFunction: folderViewFilter(view),
						recursionKey: 'items',
						sortFunction: sortFolders,
						deep: false
				  })
				: [],
		[CustomComponent, itemProps, roots, view]
	);
};

// SETTERS

// Set checked status for an array of folders
export const setFoldersChecked = (foldersIDs: Array<string>, value: boolean): void =>
	useFolderStore.setState((state) => {
		foldersIDs.forEach((folderID) => {
			state.folders[folderID].checked = value;
		});
	});
