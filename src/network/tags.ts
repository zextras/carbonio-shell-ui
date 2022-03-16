/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import produce from 'immer';
import {
	CreateTagRequest,
	CreateTagResponse,
	TagActionRequest,
	TagActionResponse
} from '../../types';
import { Tag } from '../../types/tags';
import { SHELL_APP_ID } from '../constants';
import { useTagStore } from '../store/tags';
import { getSoapFetch } from './fetch';

const set = useTagStore.setState;
export const createTag = (tag: Omit<Tag, 'id'>): Promise<string> =>
	getSoapFetch(SHELL_APP_ID)<CreateTagRequest, CreateTagResponse>('CreateTag', {
		_jsns: 'urn:zimbraMail',
		tag
	}).then((r: CreateTagResponse) => {
		set((state) => ({ tags: { ...state.tags, [r.tag[0].id]: r.tag[0] } }));
		return r.tag[0].id;
	});

export const deleteTag = (id: string): Promise<TagActionResponse> =>
	getSoapFetch(SHELL_APP_ID)<TagActionRequest, TagActionResponse>('TagAction', {
		_jsns: 'urn:zimbraMail',
		action: { op: 'delete', id }
	});

export const renameTag = (id: string, name: string): Promise<void> =>
	getSoapFetch(SHELL_APP_ID)<TagActionRequest, TagActionResponse>('TagAction', {
		_jsns: 'urn:zimbraMail',
		action: { op: 'rename', id, name }
	}).then((r: TagActionResponse) => {
		set(
			produce((state) => {
				state.tags[id].name = name;
			})
		);
	});
export const changeTagColor = (id: string, color: string | number): Promise<void> =>
	getSoapFetch(SHELL_APP_ID)<TagActionRequest, TagActionResponse>('TagAction', {
		_jsns: 'urn:zimbraMail',
		action: typeof color === 'number' ? { op: 'color', color, id } : { op: 'color', rgb: color, id }
	}).then((r: TagActionResponse) => {
		set(
			produce((state) => {
				if (color === 'number') {
					state.tags[id].color = color;
				} else {
					state.tags[id].rgb = color;
				}
			})
		);
	});
