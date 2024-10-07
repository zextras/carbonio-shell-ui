/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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

import { ACTION_TYPES } from '../constants';
import { useCurrentRoute } from '../history/hooks';
import { useAppList } from '../store/app';
import { getT } from '../store/i18n/hooks';
import { useActions } from '../store/integrations/hooks';
import type { AppRoute, CarbonioModule } from '../types/apps';
import type { Action } from '../types/integrations';

export interface NewAction extends Action, Omit<DropdownItem, 'label' | 'onClick'> {
	execute: NonNullable<DropdownItem['onClick']>;
	group?: string;
	primary?: boolean;
}

interface CreationButtonProps {
	activeRoute?: AppRoute;
	location?: Location;
}

export const CreationButtonComponent = ({
	activeRoute,
	location
}: CreationButtonProps): React.JSX.Element => {
	const t = getT();
	const actions = useActions<CreationButtonProps, NewAction>(
		{ activeRoute, location },
		ACTION_TYPES.NEW
	);
	const actionsDropdownItems = useMemo<
		(DropdownItem & Required<Pick<DropdownItem, 'onClick'>> & Omit<NewAction, 'execute'>)[]
	>(() => actions.map(({ execute, ...rest }) => ({ onClick: execute, ...rest })), [actions]);
	const [open, setOpen] = useState(false);
	const primaryAction = useMemo(
		() =>
			find(
				actionsDropdownItems,
				(action) =>
					(action.group === activeRoute?.id || action.group === activeRoute?.app) &&
					action.primary === true
			),
		[actionsDropdownItems, activeRoute?.app, activeRoute?.id]
	);
	const apps = useAppList();
	const actionsDropdownItemsByGroup = useMemo(
		() => groupBy(actionsDropdownItems, (actionsDropdownItem) => actionsDropdownItem.group),
		[actionsDropdownItems]
	);

	const secondaryActions = useMemo<DropdownItem[]>(
		(): DropdownItem[] => [
			...(actionsDropdownItemsByGroup[activeRoute?.app ?? ''] ?? []),
			...reduce<CarbonioModule, DropdownItem[]>(
				apps,
				(acc, app, i): DropdownItem[] => {
					if (app.name !== activeRoute?.app && actionsDropdownItemsByGroup[app.name]?.length > 0) {
						acc.push(
							{ type: 'divider', id: `divider-${i}` },
							...actionsDropdownItemsByGroup[app.name]
						);
					}
					return acc;
				},
				[]
			)
		],
		[activeRoute?.app, apps, actionsDropdownItemsByGroup]
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
				onClick={primaryAction.onClick}
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

export const CreationButton = (): React.JSX.Element => {
	const locationFull = useLocation();
	const activeRoute = useCurrentRoute();

	const truncateLocation = (location: Location): Location => ({
		...location,
		pathname: location?.pathname?.split('/').slice(0, 2).join('/'),
		key: ''
	});

	const location = useMemo(() => truncateLocation(locationFull), [locationFull]);
	return <MemoCreationButton activeRoute={activeRoute} location={location} />;
};
