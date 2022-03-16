/* eslint-disable @typescript-eslint/ban-types */
/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export type Tag = {
	color?: string;
	id: string;
	name: string;
	rgb?: string;
};

export type Tags = Record<string, Tag>;

export type TagState = {
	tags: Tags;
	// SYNC
	// handleSync: (arg: { notify: [NotifyObject]; refresh: NotifyObject }) => void;
	// API
	setters: {
		createTag: (arg: Omit<Tag, 'id'>) => Promise<string>;
		renameTag: (id: string, name: string) => Promise<void>;
		removeTag: (id: string) => Promise<void>;
		changeTagColor: (id: string, color: string | number) => Promise<void>;
	};
};
