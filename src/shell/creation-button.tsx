/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useMemo } from 'react';
import { reduce, groupBy } from 'lodash';
import { MultiButton } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { useActions } from '../store/integrations/hooks';
import { ACTION_TYPES } from '../constants';
import { Action, AppRoute } from '../../types';
import { useAppList } from '../store/app';

const useSecondaryActions = (
	actions: Array<Action>,
	activeRoute?: AppRoute
): Array<Action | { type: string; id: string }> => {
	const apps = useAppList();

	const byApp = useMemo(() => groupBy(actions, 'app'), [actions]);
	return useMemo(
		() => [
			...(byApp[activeRoute?.app ?? ''] ?? []),
			...reduce(
				apps,
				(acc, app, i) =>
					app.name === activeRoute?.app
						? acc
						: [...acc, { type: 'divider', id: `divider-${i}` }, ...(byApp[app.name] ?? [])],
				[] as Array<Action | { type: string; id: string }>
			)
		],
		[activeRoute?.app, apps, byApp]
	);
};

export const CreationButton: FC<{ activeRoute?: AppRoute }> = ({ activeRoute }) => {
	const [t] = useTranslation();
	const actions = useActions(activeRoute, ACTION_TYPES.NEW);
	const primaryAction = useMemo(
		() =>
			actions?.find?.(
				(a) => (a.group === activeRoute?.id || a.group === activeRoute?.app) && a.primary
			) ?? actions?.find?.((a) => a.primary),
		[actions, activeRoute?.app, activeRoute?.id]
	);
	const secondaryActions = useSecondaryActions(actions, activeRoute);

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
