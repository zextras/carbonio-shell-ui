/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useCallback, useMemo, useState } from 'react';
import { reduce, groupBy, noop } from 'lodash';
import { MultiButton, Button, Dropdown } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Location } from 'history';
import { useActions } from '../store/integrations/hooks';
import { ACTION_TYPES } from '../constants';
import { Action, AppRoute } from '../../types';
import { useAppList } from '../store/app';
import { useCurrentRoute } from '../history/hooks';

export const CreationButtonComponent: FC<{ activeRoute: AppRoute; location: Location }> = ({
	activeRoute,
	location
}) => {
	const [t] = useTranslation();
	const actions = useActions({ activeRoute, location }, ACTION_TYPES.NEW);
	const [open, setOpen] = useState(false);
	const primaryAction = useMemo(
		() =>
			actions?.find?.(
				(a) => (a.group === activeRoute?.id || a.group === activeRoute?.app) && a.primary
			),
		[actions, activeRoute?.app, activeRoute?.id]
	);
	const apps = useAppList();
	const byApp = useMemo(() => groupBy(actions, 'group'), [actions]);

	const secondaryActions = [
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
	];

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
				onClick={noop}
			/>
		</Dropdown>
	);
};

const MemoCreationButton = React.memo(CreationButtonComponent);

export const CreationButton: FC = () => {
	const locationFull = useLocation() as Location;
	const activeRoute = useCurrentRoute() as AppRoute;

	const truncateLocation = (location: Location): Location => ({
		...location,
		pathname: location?.pathname?.split('/').slice(0, 2).join('/'),
		key: ''
	});

	const location = useMemo(() => truncateLocation(locationFull), [locationFull]);
	return <MemoCreationButton activeRoute={activeRoute} location={location} />;
};
