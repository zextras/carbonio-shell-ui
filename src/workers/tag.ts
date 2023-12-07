/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SoapNotify, Tag, TagMessage, Tags } from '../../types';

export const handleTagRefresh = (tags: Array<Tag>): Tags => {
	if (typeof tags !== 'undefined') {
		return tags.reduce((acc: Tags, val: Tag): Tags => {
			// eslint-disable-next-line no-param-reassign
			acc[val.id] = val;
			return acc;
		}, {});
	}
	return {};
};

const handleTagCreated = (tags: Tags, created?: Array<Tag>): Tags => {
	if (!created) return tags;
	return created.reduce((acc: Tags, val: Tag): Tags => {
		// eslint-disable-next-line no-param-reassign
		acc[val.id] = val;
		return acc;
	}, tags);
};

const handleTagModified = (tags: Tags, modified?: Array<Partial<Tag>>): Tags => {
	if (!modified) return tags;
	return modified.reduce((acc: Tags, val: Partial<Tag>): Tags => {
		if (val.id) {
			// eslint-disable-next-line no-param-reassign
			acc[val.id] = { ...tags[val.id], ...val };
		}
		return acc;
	}, tags);
};

const handleTagDeleted = (tags: Tags, deleted?: string[]): Tags => {
	if (!deleted) return tags;
	return deleted.reduce((acc, val) => {
		// eslint-disable-next-line no-param-reassign
		delete acc[val];
		return acc;
	}, tags);
};

export const handleTagNotify = (notify: SoapNotify, state: Tags): Tags =>
	handleTagDeleted(
		handleTagModified(handleTagCreated(state, notify.created?.tag), notify.modified?.tag),
		notify.deleted
	);

function deletedIdsContainTags({
	deletedIds,
	tagIds
}: {
	deletedIds: Array<string>;
	tagIds?: Array<string>;
}): boolean {
	return deletedIds.some((deletedId) => tagIds?.includes(deletedId));
}

onmessage = ({ data }: TagMessage): void => {
	if (data.op === 'refresh' && data.tags) postMessage({ tags: handleTagRefresh(data.tags.tag) });

	const tagIds = data.state && Object.keys(data.state);
	if (
		data.op === 'notify' &&
		(data.notify.created?.tag ||
			data.notify.modified?.tag ||
			(data.notify.deleted && deletedIdsContainTags({ deletedIds: data.notify.deleted, tagIds })))
	)
		postMessage({ tags: handleTagNotify(data.notify, data.state) });
};
