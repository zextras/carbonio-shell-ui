/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { reduce } from 'lodash';
import { AccountContext, Tag, Tags } from '../../../types';
import { useTagStore } from './store';

export const handleTagSync = (context: AccountContext): void => {
	if (context.refresh?.tags?.tag) {
		useTagStore.setState({
			tags: reduce(
				context.refresh.tags?.tag,
				(acc: Tags, val: Tag): Tags => {
					// eslint-disable-next-line no-param-reassign
					acc[val.id] = val;
					return acc;
				},
				{}
			)
		});
	}
	if (context.notify) {
	}
};
