/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import produce from 'immer';
import create, { StoreApi, UseBoundStore } from 'zustand';
import { CreateTagResponse, Tag, TagActionResponse, TagState } from '../../../types';
import { changeTagColor, createTag, deleteTag, renameTag } from '../../network/tags';

export const useTagStore = create<TagState>((set) => ({
	tags: {},
	setters: {
		createTag: (tag: Omit<Tag, 'id'>): Promise<string> =>
			createTag(tag).then((r: CreateTagResponse) => {
				set((state) => ({ tags: { ...state.tags, [r.tag[0].id]: r.tag[0] } }));
				return r.tag[0].id;
			}),
		removeTag: (id: string): Promise<void> =>
			deleteTag(id).then((r: TagActionResponse) => {
				set(
					produce((state) => {
						delete state.tags[id];
					})
				);
			}),
		renameTag: (id: string, name: string): Promise<void> =>
			renameTag(id, name).then((r: TagActionResponse) => {
				set(
					produce((state) => {
						state.tags[id].name = name;
					})
				);
			}),
		changeTagColor: (id: string, color: string | number): Promise<void> =>
			changeTagColor(id, color).then((r: TagActionResponse) => {
				set(
					produce((state) => {
						if (color === 'number') {
							state.tags[id].color = color;
						} else {
							state.tags[id].rgb = color;
						}
					})
				);
			})
	}
})) as UseBoundStore<TagState, StoreApi<TagState>>;
