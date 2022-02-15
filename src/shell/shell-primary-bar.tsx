/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	Container,
	IconButton,
	Row,
	Tooltip,
	Text,
	Padding,
	Icon
} from '@zextras/carbonio-design-system';
import { map, isEmpty, trim, filter, sortBy } from 'lodash';
import React, { useContext, FC, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
// TODO: convert boards management to ts (and maybe a zustand store)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { BoardValueContext, BoardSetterContext } from './boards/board-context';
import { useAppStore } from '../store/app';
import { AppRoute, PrimaryAccessoryView, PrimaryBarView } from '../../types';
import BadgeWrap from './badge-wrap';
import { isAdmin, ShellMode } from '../multimode';
import { SHELL_MODES } from '../constants';
import AppContextProvider from '../boot/app/app-context-provider';
import { checkRoute } from '../utility-bar/utils';

const PrimaryContainer = styled(Container)<{ active: boolean }>`
	background: ${({ theme, active }): string => theme.palette[active ? 'gray4' : 'gray6'].regular};
	cursor: pointer;
	transition: background 0.2s ease-out;
	&:hover {
		background: ${({ theme, active }): string => theme.palette[active ? 'gray4' : 'gray6'].hover};
	}
	&:focus {
		background: ${({ theme, active }): string => theme.palette[active ? 'gray4' : 'gray6'].focus};
	}
`;

const ContainerWithDivider = styled(Container)`
	border-right: 1px solid ${({ theme }): string => theme.palette.gray3.regular};
`;

const ToggleBoardIcon: FC = () => {
	const { boards, minimized } = useContext(BoardValueContext);
	const { toggleMinimized } = useContext(BoardSetterContext);

	if (isEmpty(boards)) return null;
	return (
		<IconButton
			iconColor="primary"
			icon={minimized ? 'BoardOpen' : 'BoardCollapse'}
			onClick={toggleMinimized}
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

const AdminPrimaryBarElement: FC<PrimaryBarItemProps> = ({ view, active, onClick }) => (
	<PrimaryContainer
		orientation="horizontal"
		mainAlignment="flex-start"
		height="48px"
		onClick={onClick}
	>
		<BadgeWrap badge={view.badge}>
			{typeof view.component === 'string' ? (
				<Icon icon={view.component} color={active ? 'primary' : 'text'} size="large" />
			) : (
				<view.component active={active} />
			)}
		</BadgeWrap>
		<Padding right="large">
			<Text color={active ? 'primary' : 'text'}>{view.label}</Text>
		</Padding>
	</PrimaryContainer>
);

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
				/>
			) : (
				<view.component active={active} />
			)}
		</BadgeWrap>
	</Tooltip>
);

const PrimaryBarAccessoryElement: FC<PrimaryBarAccessoryItemProps> = ({ view }) =>
	isAdmin() ? (
		<AppContextProvider key={view.id} pkg={view.app}>
			<PrimaryContainer
				orientation="horizontal"
				mainAlignment="flex-start"
				height="48px"
				onClick={view.onClick}
			>
				<Container width={48} height={48} style={{ position: 'relative' }}>
					{typeof view.component === 'string' ? (
						<Icon icon={view.component} size="large" />
					) : (
						<view.component />
					)}
				</Container>
				<Padding right="large">
					<Text>{view.label}</Text>
				</Padding>
			</PrimaryContainer>
		</AppContextProvider>
	) : (
		<Tooltip label={view.label} placement="right" key={view.id}>
			<AppContextProvider key={view.id} pkg={view.app}>
				{typeof view.component === 'string' ? (
					<IconButton
						icon={view.component}
						backgroundColor="gray6"
						iconColor="text"
						onClick={view.onClick}
						size="large"
					/>
				) : (
					<view.component />
				)}
			</AppContextProvider>
		</Tooltip>
	);

const ShellPrimaryBar: FC<{ activeRoute: AppRoute }> = ({ activeRoute }) => {
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
			setRoutes((r) => ({ ...r, [activeRoute.id]: trim(history.location.pathname, '/') }));
		}
	}, [activeRoute, history.location.pathname, primaryBarViews]);
	const primaryBarAccessoryViews = useAppStore((s) => s.views.primaryBarAccessories);
	const accessories = useMemo(
		() =>
			sortBy(
				filter(primaryBarAccessoryViews, (v) => checkRoute(v, activeRoute)),
				'position'
			),
		[activeRoute, primaryBarAccessoryViews]
	);
	return (
		<ContainerWithDivider
			width={isAdmin() ? 'fit' : 49}
			height="fill"
			background="gray6"
			orientation="vertical"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
		>
			<Row
				mainAlignment="flex-start"
				crossAlignment="flex-start"
				orientation="vertical"
				takeAvailableSpace
				wrap="nowrap"
				style={{ minHeight: '1px', overflowY: 'overlay' }}
			>
				<ShellMode include={[SHELL_MODES.ADMIN]}>
					{map(primaryBarViews, (view) =>
						// eslint-disable-next-line no-nested-ternary
						view.visible ? (
							<AdminPrimaryBarElement
								key={view.id}
								onClick={(): void => history.push(`/${routes[view.id]}`)}
								view={view}
								active={activeRoute?.id === view.id}
							/>
						) : null
					)}
				</ShellMode>
				<ShellMode exclude={[SHELL_MODES.ADMIN]}>
					{map(primaryBarViews, (view) =>
						// eslint-disable-next-line no-nested-ternary
						view.visible ? (
							<PrimaryBarElement
								key={view.id}
								onClick={(): void => history.push(`/${routes[view.id]}`)}
								view={view}
								active={activeRoute?.id === view.id}
							/>
						) : null
					)}
				</ShellMode>
			</Row>
			<Row
				mainAlignment="flex-end"
				orientation="vertical"
				wrap="nowrap"
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

export default ShellPrimaryBar;
