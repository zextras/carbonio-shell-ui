/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect, useMemo, useRef } from 'react';

import { Button, Container, Row, Tooltip } from '@zextras/carbonio-design-system';
import { map, isEmpty, trim, filter, sortBy } from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import BadgeWrap from './badge-wrap';
import { AppContextProvider } from '../boot/app/app-context-provider';
import { BOARD_CONTAINER_ZINDEX, PRIMARY_BAR_WIDTH, SEARCH_APP_ID } from '../constants';
import { useCurrentRoute } from '../history/hooks';
import { useAppStore } from '../store/app';
import { minimizeBoards, reopenBoards, useBoardStore } from '../store/boards';
import type { PrimaryAccessoryView, PrimaryBarView } from '../types/apps';
import { checkRoute } from '../utility-bar/utils';

function noop(): void {
	return undefined;
}

const PrimaryBarContainer = styled(Container)`
	border-right: 0.0625rem solid ${({ theme }): string => theme.palette.gray3.regular};
	z-index: ${BOARD_CONTAINER_ZINDEX + 1};
`;

const ToggleBoardIcon = (): React.JSX.Element | null => {
	const { minimized, boards } = useBoardStore();

	return isEmpty(boards) ? null : (
		<Container width={'3rem'} height={'3rem'}>
			<Button
				type={'ghost'}
				color="primary"
				icon={minimized ? 'BoardOpen' : 'BoardCollapse'}
				onClick={minimized ? reopenBoards : minimizeBoards}
				size="large"
			/>
		</Container>
	);
};

type PrimaryBarItemProps = {
	view: PrimaryBarView;
	active: boolean;
	onClick: () => void;
};

type PrimaryBarAccessoryItemProps = {
	view: PrimaryAccessoryView;
};

const PrimaryBarElement = ({ view, active, onClick }: PrimaryBarItemProps): React.JSX.Element => (
	<Tooltip label={view.label} placement="right" key={view.id}>
		<BadgeWrap badge={view.badge}>
			{typeof view.component === 'string' ? (
				<Button
					icon={view.component}
					backgroundColor={active ? 'gray4' : 'gray6'}
					labelColor={active ? 'primary' : 'text'}
					onClick={onClick}
					size="large"
				/>
			) : (
				<view.component active={active} onClick={onClick} />
			)}
		</BadgeWrap>
	</Tooltip>
);

const PrimaryBarAccessoryElement = ({ view }: PrimaryBarAccessoryItemProps): React.JSX.Element => (
	<Tooltip label={view.label} placement="right" key={view.id}>
		<AppContextProvider key={view.id} pkg={view.app}>
			{typeof view.component === 'string' ? (
				<Button
					icon={view.component}
					backgroundColor="gray6"
					labelColor="text"
					onClick={view.onClick ?? noop}
					size="large"
				/>
			) : (
				<view.component />
			)}
		</AppContextProvider>
	</Tooltip>
);

const OverlayRow = styled(Row)`
	min-height: 0.0625rem;
	overflow-y: auto;
	overflow-y: overlay;
`;

const ShellPrimaryBar = (): React.JSX.Element | null => {
	const activeRoute = useCurrentRoute();
	const primaryBarViews = useAppStore((s) => s.views.primaryBar);
	const { push } = useHistory();

	const { pathname, search } = useLocation();
	const routesRef = useRef<Record<string, string>>({});

	useEffect(() => {
		routesRef.current = primaryBarViews.reduce((accumulator, view) => {
			if (!accumulator[view.id]) {
				accumulator[view.id] = view.route;
			}
			return accumulator;
		}, routesRef.current);
	}, [primaryBarViews]);

	useEffect(() => {
		if (activeRoute && activeRoute.id !== SEARCH_APP_ID) {
			routesRef.current = {
				...routesRef.current,
				[activeRoute.id]: `${trim(pathname, '/')}${search}`
			};
		}
	}, [activeRoute, pathname, search]);

	const primaryBarAccessoryViews = useAppStore((s) => s.views.primaryBarAccessories);

	const accessoryViews = useMemo(
		() =>
			sortBy(
				filter(primaryBarAccessoryViews, (v) => checkRoute(v, activeRoute)),
				'position'
			),
		[activeRoute, primaryBarAccessoryViews]
	);

	const primaryBarItems = useMemo(
		() =>
			map(primaryBarViews, (view) =>
				view.visible ? (
					<PrimaryBarElement
						key={view.id}
						onClick={(): void => push(`/${routesRef.current[view.id]}`)}
						view={view}
						active={activeRoute?.id === view.id}
					/>
				) : null
			),
		[activeRoute?.id, push, primaryBarViews]
	);

	const accessoryItems = useMemo(
		() => accessoryViews.map((view) => <PrimaryBarAccessoryElement view={view} key={view.id} />),
		[accessoryViews]
	);

	return (
		<PrimaryBarContainer
			width={PRIMARY_BAR_WIDTH}
			height="fill"
			background={'gray6'}
			orientation="vertical"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
			data-testid="SideMenuContainer"
		>
			<OverlayRow
				mainAlignment="flex-start"
				crossAlignment="flex-start"
				orientation="vertical"
				takeAvailableSpace
				wrap="nowrap"
			>
				{primaryBarItems}
				<ToggleBoardIcon />
			</OverlayRow>
			<OverlayRow mainAlignment="flex-end" orientation="vertical" wrap="nowrap">
				{accessoryItems}
			</OverlayRow>
		</PrimaryBarContainer>
	);
};

export default ShellPrimaryBar;
