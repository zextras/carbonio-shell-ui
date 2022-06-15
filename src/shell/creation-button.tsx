/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useCallback, useMemo, useState } from 'react';
import { reduce, groupBy } from 'lodash';
import { MultiButton, Button, Dropdown } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useActions } from '../store/integrations/hooks';
import { ACTION_TYPES } from '../constants';
import { Action, AppRoute } from '../../types';
import { useAppList } from '../store/app';
import { emptyFunction } from '../utils';

const useSecondaryActions = (
	actions: Array<Action>,
	activeRoute?: AppRoute
): Array<Action | { type: 'divider'; id: string; label: string }> => {
	const apps = useAppList();

	const byApp = useMemo(() => groupBy(actions, 'group'), [actions]);
	return useMemo(
		() => [
			...(byApp[activeRoute?.app ?? ''] ?? []),
			...reduce(
				apps,
				(acc, app, i) => {
					if (app.name !== activeRoute?.app && byApp[app.name]?.length > 0) {
						acc.push({ type: 'divider', label: '', id: `divider-${i}` }, ...byApp[app.name]);
					}
					return acc;
				},
				[] as Array<Action | { type: 'divider'; id: string; label: string }>
			)
		],
		[activeRoute?.app, apps, byApp]
	);
};

export const CreationButton: FC<{ activeRoute?: AppRoute }> = ({ activeRoute }) => {
	const [t] = useTranslation();
	const location = useLocation();
	const actions = useActions({ activeRoute, location }, ACTION_TYPES.NEW);
	const [open, setOpen] = useState(false);
	const primaryAction = useMemo(
		() =>
			actions?.find?.(
				(a) => (a.group === activeRoute?.id || a.group === activeRoute?.app) && a.primary
			),
		[actions, activeRoute?.app, activeRoute?.id]
	);
	const secondaryActions = useSecondaryActions(actions, activeRoute);

	const onClose = useCallback(() => {
		setOpen(false);
	}, []);
	const onOpen = useCallback(() => {
		setOpen(true);
	}, []);
	return primaryAction ? (
		<MultiButton
			size="extralarge"
			background="primary"
			label={primaryAction?.label ?? t('new', 'New')}
			onClick={primaryAction?.click}
			items={secondaryActions}
			disabledPrimary={!primaryAction || primaryAction?.disabled}
			disabledSecondary={!secondaryActions?.length}
		/>
	) : (
		<Dropdown items={secondaryActions} onClose={onClose} onOpen={onOpen}>
			<Button
				size="extralarge"
				backgroundColor="primary"
				label={t('new', 'New')}
				icon={open ? 'ChevronUp' : 'ChevronDown'}
				onClick={emptyFunction}
			/>
		</Dropdown>
	);
};
