/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useMemo } from 'react';
import { reduce, find, sortBy } from 'lodash';
import { MultiButton } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { useActions } from '../store/integrations/hooks';
import { ACTION_TYPES } from '../constants';
import { Action, AppRoute } from '../../types';

export const CreationButton: FC<{ activeRoute?: AppRoute }> = ({ activeRoute }) => {
	const [t] = useTranslation();

	const actions = useActions(activeRoute, ACTION_TYPES.NEW);

	const primaryAction = useMemo<Action | undefined>(
		() =>
			find(actions, (a) => a.group === activeRoute?.id && a.primary) ??
			(find(actions, (a) => a.primary) as Action | undefined),
		[actions, activeRoute?.id]
	);

	const secondaryActions = useMemo(
		() =>
			reduce(
				sortBy(actions, (a) => a.group),
				(acc, action, i) => {
					if (action.group !== acc.prevGroup) {
						if (acc.prevGroup !== '') {
							acc.list.push({ type: 'divider', id: `divider-${i}` });
						}
						// eslint-disable-next-line no-param-reassign
						acc.prevGroup = action.group ?? '';
					}
					acc.list.push(action);
					return acc;
				},
				{
					list: [] as Array<Action | { type: 'divider'; id: string }>,
					prevGroup: ''
				}
			).list,
		[actions]
	);

	return (
		<MultiButton
			style={{ height: '42px' }}
			background="primary"
			label={primaryAction?.label ?? t('new', 'New')}
			onClick={primaryAction?.click}
			items={secondaryActions}
			disabled={!primaryAction || primaryAction?.disabled}
		/>
	);
};
