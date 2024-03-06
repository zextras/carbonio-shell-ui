/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getSoapFetch } from './fetch';
import { SHELL_APP_ID } from '../constants';
import type {
	CreateTagRequest,
	CreateTagResponse,
	TagActionRequest,
	TagActionResponse
} from '../types/network';
import type { Tag } from '../types/tags';

export const createTag = (tag: Omit<Tag, 'id'>): Promise<CreateTagResponse> =>
	getSoapFetch(SHELL_APP_ID)<CreateTagRequest, CreateTagResponse>('CreateTag', {
		_jsns: 'urn:zimbraMail',
		tag
	});
export const deleteTag = (id: string): Promise<TagActionResponse> =>
	getSoapFetch(SHELL_APP_ID)<TagActionRequest, TagActionResponse>('TagAction', {
		_jsns: 'urn:zimbraMail',
		action: { op: 'delete', id }
	});

export const renameTag = (id: string, name: string): Promise<TagActionResponse> =>
	getSoapFetch(SHELL_APP_ID)<TagActionRequest, TagActionResponse>('TagAction', {
		_jsns: 'urn:zimbraMail',
		action: { op: 'rename', id, name }
	});

export const changeTagColor = (id: string, color: string | number): Promise<TagActionResponse> =>
	getSoapFetch(SHELL_APP_ID)<TagActionRequest, TagActionResponse>('TagAction', {
		_jsns: 'urn:zimbraMail',
		action: typeof color === 'number' ? { op: 'color', color, id } : { op: 'color', rgb: color, id }
	});
