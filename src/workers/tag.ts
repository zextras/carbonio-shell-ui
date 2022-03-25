/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/* eslint-disable no-restricted-globals */

import { SoapNotify, Tag, TagMessage, Tags } from '../../types';

export const handleTagRefresh = (tags: Array<Tag>): Tags =>
	tags.reduce((acc: Tags, val: Tag): Tags => {
		// eslint-disable-next-line no-param-reassign
		acc[val.id] = val;
		return acc;
	}, {});

export const handleTagCreated = (tags: Tags, created: Array<Tag>): Tags =>
	created.reduce((acc: Tags, val: Tag): Tags => {
		// eslint-disable-next-line no-param-reassign
		acc[val.id] = val;
		return acc;
	}, tags);
export const handleTagModified = (tags: Tags, modified: Array<Partial<Tag>>): Tags =>
	modified.reduce((acc: Tags, val: Partial<Tag>): Tags => {
		if (val.id) {
			// eslint-disable-next-line no-param-reassign
			acc[val.id] = { ...tags[val.id], ...val };
		}
		return acc;
	}, tags);
export const handleTagDeleted = (tags: Tags, deleted: string[]): Tags =>
	deleted.reduce((acc, val) => {
		// eslint-disable-next-line no-param-reassign
		delete acc[val];
		return acc;
	}, tags);
export const handleTagNotify = (notify: SoapNotify, state: Tags): void => {
	handleTagDeleted(
		handleTagModified(
			handleTagCreated(state, notify.created?.tag ?? []),
			notify.modified?.tag ?? []
		),
		notify.deleted ?? []
	);
};

self.onmessage = ({ data }: TagMessage): void => {
	if (data.op === 'refresh' && data.tags) self.postMessage(handleTagRefresh(data.tags));
	if (data.op === 'notify') self.postMessage(handleTagNotify(data.notify, data.state));
};
