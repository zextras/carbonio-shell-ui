/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { BaseFolder, LinkFolderFields, SearchFolderFields } from '../misc';

export type FolderFields = {
	// Additional Parameters
	isLink: boolean;
	depth: number;
	parent?: Folder;
	children: Array<Folder>;
};

export type UserFolder = BaseFolder & FolderFields & { isLink: false };

export type LinkFolder = BaseFolder & FolderFields & LinkFolderFields & { isLink: true };

export type SearchFolder = BaseFolder &
	Pick<FolderFields, 'parent' | 'isLink'> &
	SearchFolderFields;
export type Folder = UserFolder | LinkFolder;

export type Folders = { [id: string]: Folder };
export type Roots = { [id: string]: Folder };
export type Searches = { [id: string]: SearchFolder };
export type FolderState = {
	folders: Folders;
	roots: Roots;
	searches: Searches;
};
