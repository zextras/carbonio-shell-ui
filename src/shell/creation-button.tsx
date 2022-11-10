/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Container, Dropdown, MultiButton } from '@zextras/carbonio-design-system';
import { Location } from 'history';
import { groupBy, noop, reduce } from 'lodash';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Action, AppRoute } from '../../types';
import { ACTION_TYPES } from '../constants';
import { useCurrentRoute } from '../history/hooks';
import { useAppList } from '../store/app';
import { getT } from '../store/i18n';
import { useActions } from '../store/integrations/hooks';

export const CreationButtonComponent: FC<{ activeRoute: AppRoute; location: Location }> = ({
	activeRoute,
	location
}) => {
	const t = getT();
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
		<Container minWidth="80px">
			<MultiButton
				size="extralarge"
				background="primary"
				label={primaryAction?.label ?? t('new', 'New')}
				onClick={primaryAction?.click}
				items={secondaryActions}
				disabledPrimary={!primaryAction || primaryAction?.disabled}
				disabledSecondary={!secondaryActions?.length}
			/>
		</Container>
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
