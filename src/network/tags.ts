/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getSoapFetch } from './fetch';
import { JSNS, SHELL_APP_ID } from '../constants';
import type { SoapBody } from '../types/network';
import type { Tag } from '../types/tags';

export type CreateTagRequest = SoapBody<{
	tag: Omit<Tag, 'id'>;
}>;
export type CreateTagResponse = {
	tag: [Tag];
};
export type TagActionRequest = SoapBody<{
	action: {
		op: 'rename' | 'color' | 'delete' | 'update';
		id: string;
		name?: string;
		color?: number;
		rgb?: string;
	};
}>;
export type TagActionResponse = SoapBody<{
	action: { op: string; id: string };
}>;

export const createTag = (tag: Omit<Tag, 'id'>): Promise<CreateTagResponse> =>
	getSoapFetch(SHELL_APP_ID)<CreateTagRequest, CreateTagResponse>('CreateTag', {
		_jsns: JSNS.MAIL,
		tag
	});
export const deleteTag = (id: string): Promise<TagActionResponse> =>
	getSoapFetch(SHELL_APP_ID)<TagActionRequest, TagActionResponse>('TagAction', {
		_jsns: JSNS.MAIL,
		action: { op: 'delete', id }
	});

export const renameTag = (id: string, name: string): Promise<TagActionResponse> =>
	getSoapFetch(SHELL_APP_ID)<TagActionRequest, TagActionResponse>('TagAction', {
		_jsns: JSNS.MAIL,
		action: { op: 'rename', id, name }
	});

export const changeTagColor = (id: string, color: string | number): Promise<TagActionResponse> =>
	getSoapFetch(SHELL_APP_ID)<TagActionRequest, TagActionResponse>('TagAction', {
		_jsns: JSNS.MAIL,
		action: typeof color === 'number' ? { op: 'color', color, id } : { op: 'color', rgb: color, id }
	});
