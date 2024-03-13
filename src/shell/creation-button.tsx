/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { FC } from 'react';
import React, { useCallback, useMemo, useState } from 'react';

import {
	Button,
	Container,
	Dropdown,
	type DropdownItem,
	MultiButton
} from '@zextras/carbonio-design-system';
import type { Location } from 'history';
import { find, groupBy, noop, reduce } from 'lodash';
import { useLocation } from 'react-router-dom';

import { useCurrentRoute } from '../history/hooks';
import { useAppList } from '../store/app';
import { getT } from '../store/i18n/hooks';
import { useActions } from '../store/integrations/hooks';
import type { AppRoute, CarbonioModule } from '../types/apps';

interface CreationButtonProps {
	activeRoute: AppRoute;
	location: Location;
}

export const CreationButtonComponent = ({
	activeRoute,
	location
}: CreationButtonProps): React.JSX.Element => {
	const t = getT();
	const actions = useActions({ activeRoute, location }, 'new');
	const [open, setOpen] = useState(false);
	const primaryAction = useMemo(
		() =>
			find(
				actions,
				(action) =>
					(action.group === activeRoute?.id || action.group === activeRoute?.app) &&
					action.primary === true
			),
		[actions, activeRoute?.app, activeRoute?.id]
	);
	const apps = useAppList();
	const byApp = useMemo(() => groupBy(actions, 'group'), [actions]);

	const secondaryActions = useMemo<DropdownItem[]>(
		(): DropdownItem[] => [
			...(byApp[activeRoute?.app ?? ''] ?? []),
			...reduce<CarbonioModule, DropdownItem[]>(
				apps,
				(acc, app, i): DropdownItem[] => {
					if (app.name !== activeRoute?.app && byApp[app.name]?.length > 0) {
						acc.push({ type: 'divider', label: '', id: `divider-${i}` }, ...byApp[app.name]);
					}
					return acc;
				},
				[]
			)
		],
		[activeRoute?.app, apps, byApp]
	);

	const onClose = useCallback(() => {
		setOpen(false);
	}, []);
	const onOpen = useCallback(() => {
		setOpen(true);
	}, []);

	return primaryAction ? (
		<Container minWidth="80px">
			<MultiButton
				data-testid="NewItemButton"
				size="extralarge"
				background={'primary'}
				label={t('new', 'New')}
				onClick={primaryAction.onClick || primaryAction.click || noop}
				items={secondaryActions}
				disabledPrimary={!primaryAction || primaryAction?.disabled}
				disabledSecondary={!secondaryActions?.length}
			/>
		</Container>
	) : (
		<Dropdown items={secondaryActions} onClose={onClose} onOpen={onOpen}>
			<Button
				data-testid="NewItemButton"
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
