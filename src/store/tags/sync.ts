/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { forEach, reduce } from 'lodash';
import { SoapContext, Tag, Tags } from '../../../types';
import { useTagStore } from './store';

export const handleTagRefresh = (tags: Array<Tag>): Tags =>
	reduce(
		tags,
		(acc: Tags, val: Tag): Tags => {
			// eslint-disable-next-line no-param-reassign
			acc[val.id] = val;
			return acc;
		},
		{}
	);

export const handleTagCreated = (tags: Tags, created: Array<Tag>): Tags =>
	reduce(
		created,
		(acc: Tags, val: Tag): Tags => {
			// eslint-disable-next-line no-param-reassign
			acc[val.id] = val;
			return acc;
		},
		tags
	);
export const handleTagModified = (tags: Tags, modified: Array<Partial<Tag>>): Tags =>
	reduce(
		modified,
		(acc: Tags, val: Partial<Tag>): Tags => {
			if (val.id) {
				// eslint-disable-next-line no-param-reassign
				acc[val.id] = { ...tags[val.id], ...val };
			}
			return acc;
		},
		tags
	);
export const handleTagDeleted = (tags: Tags, deleted: string[]): Tags =>
	reduce(
		deleted,
		(acc, val) => {
			// eslint-disable-next-line no-param-reassign
			delete acc[val];
			return acc;
		},
		tags
	);
export const handleTagSync = (context: SoapContext): void => {
	if (context.refresh?.tags?.tag) {
		useTagStore.setState({
			tags: handleTagRefresh(context.refresh.tags.tag)
		});
	}
	if (context.notify) {
		forEach(context.notify, (notify) => {
			if (notify.created?.tag) {
				useTagStore.setState({
					tags: handleTagCreated(useTagStore.getState().tags, notify.created?.tag)
				});
			}
			if (notify.modified?.tag) {
				useTagStore.setState({
					tags: handleTagModified(useTagStore.getState().tags, notify.modified?.tag)
				});
			}
			if (notify.deleted) {
				useTagStore.setState({
					tags: handleTagDeleted(useTagStore.getState().tags, notify.deleted)
				});
			}
		});
	}
};
