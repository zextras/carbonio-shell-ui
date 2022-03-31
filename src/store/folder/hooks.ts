/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BaseFolder, Folder, Folders, LinkFolder, Searches, SearchFolder } from '../../../types';
import { useFolderStore } from './store';

// FOLDERS
export const useFolder = (id: string): BaseFolder | Folder | LinkFolder | undefined =>
	useFolderStore((s) => (s.folders ? s.folders[id] : undefined));
export const getFolder = (id: string): BaseFolder | Folder | LinkFolder | undefined => {
	const folders = useFolderStore.getState();
	return folders.folders ? folders.folders[id] : undefined;
};
export const useFolders = (): Folders => useFolderStore((s) => s.folders) ?? {};
export const getFolders = (): Folders => useFolderStore.getState().folders ?? {};

// ROOTS
export const useRoot = (id: string): BaseFolder | Folder | LinkFolder | Record<string, never> =>
	useFolderStore((s) => (s.roots ? s.roots[id] : {}));
export const getRoot = (id: string): BaseFolder | Folder | LinkFolder | Record<string, never> => {
	const folders = useFolderStore.getState();
	return folders.roots ? folders.roots[id] : {};
};
export const useRoots = (): Folders => useFolderStore((s) => s.roots) ?? {};
export const getRoots = (): Folders => useFolderStore.getState().roots ?? {};

// ROOTS BY VIEW
export const useRootByView = (
	view: string
): Folder | LinkFolder | SearchFolder | Record<string, never> =>
	useFolderStore((s) => (s.roots ? s.roots[view] : {}));
export const getRootByView = (
	view: string
): Folder | LinkFolder | SearchFolder | Record<string, never> => {
	const folders = useFolderStore.getState();
	return folders.roots ? folders.roots[view] : {};
};

// SEARCHES

export const useSearch = (id: string): SearchFolder | Record<string, never> =>
	useFolderStore((s) => (s.searches ? s.searches[id] : {}));
export const getSearch = (id: string): SearchFolder | Record<string, never> => {
	const searches = useFolderStore.getState();
	return searches.searches ? searches.searches[id] : {};
};
export const useSearches = (): Searches => useFolderStore((s) => s.searches) ?? {};
export const getSearches = (): Searches => useFolderStore.getState().searches ?? {};
