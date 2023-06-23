/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ComponentType, FC, FunctionComponent } from 'react';

import { Accordion, Collapse, Container, Padding } from '@zextras/carbonio-design-system';
import { reduce, find } from 'lodash';
import { useHistory } from 'react-router-dom';

import { AppRoute, SecondaryBarComponentProps } from '../../types';
import AppContextProvider from '../boot/app/app-context-provider';
import { getCurrentRoute } from '../history/hooks';
import { useAppStore } from '../store/app';

type SidebarComponentProps = {
	item: ShellMobileNavComponent;
};

const SidebarComponent: FC<SidebarComponentProps> = ({ item }) =>
	item.secondary ? (
		<AppContextProvider pkg={item.id}>
			<item.secondary expanded={!!item.expanded} />
		</AppContextProvider>
	) : null;

type ShellMobileNavComponentProps = {
	mobileNavIsOpen: boolean;
	menuTree: AppRoute;
};

type ShellMobileNavComponent = {
	id: string;
	label: string;
	icon: string;
	secondary?: ComponentType<SecondaryBarComponentProps>;
	onClick?: () => void;
	CustomComponent?: FunctionComponent<SidebarComponentProps> | null;
	items?: Array<ShellMobileNavComponent> | [];
	expanded?: boolean;
};

const ShellMobileNavComponent: FC<ShellMobileNavComponentProps> = ({
	mobileNavIsOpen,
	menuTree
}) => {
	const history = useHistory();
	const views = useAppStore<any>((s) =>
		reduce(
			s.routes,
			(acc: Array<ShellMobileNavComponent>, val) => {
				const primary = find(s.views.primaryBar, (item) => item.id === val.id);
				const secondary = find(s.views.secondaryBar, (item) => item.id === val.id);
				if (primary && primary.visible) {
					acc.push({
						id: `${val.app}-wrap`,
						label: primary.label,
						icon: typeof primary.component === 'string' ? primary.component : 'Cube',
						onClick: () => history.push(`/${val.route}`),
						items: secondary
							? [
									{
										id: secondary.id,
										label: secondary.id,
										icon: 'Cube',
										secondary: secondary.component,
										CustomComponent: SidebarComponent
									}
							  ]
							: []
					});
				}
				return acc;
			},
			[]
		)
	);

	return (
		<Container
			height="fill"
			width="fit"
			background="gray5"
			style={{
				position: 'absolute',
				left: 0,
				top: 0,
				zIndex: 3
			}}
		>
			<Collapse orientation="horizontal" open={mobileNavIsOpen} crossSize="100%">
				<Container
					width={256 + 48 + 12}
					height="fill"
					orientation="vertical"
					mainAlignment="space-between"
					style={{
						maxHeight: 'calc(100vh - 3rem)',
						overflowY: 'auto'
					}}
				>
					<Container width="fill" height="fit" orientation="vertical" mainAlignment="space-between">
						<Accordion items={views} />
					</Container>
					<Container width="fill" height="fit" orientation="vertical" mainAlignment="flex-end">
						<Accordion items={[menuTree]} />
						<Padding vertical="medium">{/* <UserQuota mobileView={true}/> */}</Padding>
					</Container>
				</Container>
			</Collapse>
		</Container>
	);
};

const ShellMobileNavMemo = React.memo(ShellMobileNavComponent);

type ShellMobileNavProps = {
	mobileNavIsOpen: boolean;
};

const ShellMobileNav: FC<ShellMobileNavProps> = ({ mobileNavIsOpen }) => {
	const menuTree = getCurrentRoute() as AppRoute;
	return <ShellMobileNavMemo menuTree={menuTree} mobileNavIsOpen={mobileNavIsOpen} />;
};

export default ShellMobileNav;
