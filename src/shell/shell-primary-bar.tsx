/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Container, IconButton, Row, Tooltip } from '@zextras/carbonio-design-system';
import { map, isEmpty, trim, filter, sortBy, noop } from 'lodash';
import React, { FC, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useAppStore } from '../store/app';
import { AppRoute, PrimaryAccessoryView, PrimaryBarView } from '../../types';
import BadgeWrap from './badge-wrap';
import AppContextProvider from '../boot/app/app-context-provider';
import { checkRoute } from '../utility-bar/utils';
import { IS_STANDALONE } from '../constants';
import { minimizeBoards, reopenBoards, useBoardStore } from '../store/boards';
import { useCurrentRoute } from '../history/hooks';

const ContainerWithDivider = styled(Container)`
	border-right: 1px solid ${({ theme }): string => theme.palette.gray3.regular};
`;

const ToggleBoardIcon: FC = () => {
	const { minimized, boards } = useBoardStore();
	if (isEmpty(boards)) return null;
	return (
		<IconButton
			iconColor="primary"
			icon={minimized ? 'BoardOpen' : 'BoardCollapse'}
			onClick={minimized ? reopenBoards : minimizeBoards}
			size="large"
		/>
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

const PrimaryBarElement: FC<PrimaryBarItemProps> = ({ view, active, onClick }) => (
	<Tooltip label={view.label} placement="right" key={view.id}>
		<BadgeWrap badge={view.badge}>
			{typeof view.component === 'string' ? (
				<IconButton
					icon={view.component}
					backgroundColor={active ? 'gray4' : 'gray6'}
					iconColor={active ? 'primary' : 'text'}
					onClick={onClick}
					size="large"
					data-isselected={active}
				/>
			) : (
				<view.component active={active} />
			)}
		</BadgeWrap>
	</Tooltip>
);

const PrimaryBarAccessoryElement: FC<PrimaryBarAccessoryItemProps> = ({ view }) => (
	<Tooltip label={view.label} placement="right" key={view.id}>
		<AppContextProvider key={view.id} pkg={view.app}>
			{typeof view.component === 'string' ? (
				<IconButton
					icon={view.component}
					backgroundColor="gray6"
					iconColor="text"
					onClick={view.onClick ?? noop}
					size="large"
				/>
			) : (
				<view.component />
			)}
		</AppContextProvider>
	</Tooltip>
);

const ShellPrimaryBarComponent: FC<{ activeRoute: AppRoute }> = ({ activeRoute }) => {
	const primaryBarViews = useAppStore((s) => s.views.primaryBar);
	const [routes, setRoutes] = useState<Record<string, string>>({});
	const history = useHistory();

	useEffect(() => {
		setRoutes((r) =>
			primaryBarViews.reduce((acc, v) => {
				// eslint-disable-next-line no-param-reassign
				if (!acc[v.id]) acc[v.id] = v.route;
				return acc;
			}, r)
		);
	}, [primaryBarViews]);
	useEffect(() => {
		if (activeRoute) {
			setRoutes((r) => ({
				...r,
				[activeRoute.id]: `${trim(history.location.pathname, '/')}${history.location.search}`
			}));
		}
	}, [activeRoute, history.location, primaryBarViews]);
	const primaryBarAccessoryViews = useAppStore((s) => s.views.primaryBarAccessories);
	const accessories = useMemo(
		() =>
			sortBy(
				filter(primaryBarAccessoryViews, (v) => checkRoute(v, activeRoute)),
				'position'
			),
		[activeRoute, primaryBarAccessoryViews]
	);
	if (IS_STANDALONE && activeRoute?.standalone?.hidePrimaryBar) {
		return null;
	}
	return (
		<ContainerWithDivider
			width={49}
			height="fill"
			background="gray6"
			orientation="vertical"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
			data-testid="SideMenuContainer"
		>
			<Row
				mainAlignment="flex-start"
				crossAlignment="flex-start"
				orientation="vertical"
				takeAvailableSpace
				wrap="nowrap"
				style={{
					minHeight: '1px',
					// TODO: fix overlay usage
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					overflowY: 'overlay'
				}}
			>
				{map(primaryBarViews, (view) =>
					view.visible ? (
						<PrimaryBarElement
							key={view.id}
							onClick={(): void => history.push(`/${routes[view.id]}`)}
							view={view}
							active={activeRoute?.id === view.id}
						/>
					) : null
				)}
			</Row>
			<Row
				mainAlignment="flex-end"
				orientation="vertical"
				wrap="nowrap"
				// TODO: fix overlay usage
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				style={{ minHeight: '1px', overflowY: 'overlay' }}
			>
				{accessories.map((v) => (
					<PrimaryBarAccessoryElement view={v} key={v.id} />
				))}
				<ToggleBoardIcon />
			</Row>
		</ContainerWithDivider>
	);
};

const MemoShellPrimaryBarComponent = React.memo(ShellPrimaryBarComponent);

const ShellPrimaryBar: FC = () => {
	const activeRoute = useCurrentRoute() as AppRoute;
	return <MemoShellPrimaryBarComponent activeRoute={activeRoute} />;
};

export default ShellPrimaryBar;
