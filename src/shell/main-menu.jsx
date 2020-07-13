/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { useContext, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { map, reduce } from 'lodash';
import { Route, Switch, useHistory } from 'react-router-dom';
import {
	Accordion,
	Container,
	Collapse,
	Collapser,
	IconButton,
	Padding,
	Responsive,
	Quota
} from '@zextras/zapp-ui';
import { useAppsCache } from '../app/app-loader-context';
import { useTranslation } from '../i18n/hooks';

function collectAllTo(pkgName, { to, children }) {
	return reduce(
		children || [],
		(r, v, k) => {
			return [...r, ...collectAllTo(pkgName, v)];
		},
		[`/${pkgName}${to}`]
	);
}

const HAS_SEARCH_REG = /\?/;
function getAppLinkObj( to, pkg ) {
	if (typeof to === 'string') {
		let urlTo = '';
		let urlSearch = '';
		if (HAS_SEARCH_REG.test(to)) {
			[urlTo, urlSearch] = to.split('?');
		}
		else {
			urlTo = to;
		}
		return { pathname: `/${pkg.package}${urlTo}`, search: urlSearch };
	}
	else {
		return { ...to, pathname: `/${pkg.package}${to.pathname}` };
	}
}

function getFolderStructures( folders, app, history ) {
	const newMap = map(folders, (folder) => {
		const children = {
			id: folder.id,
			label: folder.label,
			click: () => { history.push(getAppLinkObj(folder.to, app.pkg)); },
		};
		if (folder.icon) children.icon = folder.icon;
		if (folder.children) children.items = getFolderStructures(folder.children, app, history);
		return children;
	});
	return newMap;
}

const AppIcon = styled(IconButton)`
	${(props) => props.active && css`
		background-color: ${props.theme.palette.gray5.regular}
	`}	
`;

export default function MainMenu({ navigationBarIsOpen, onCollapserClick }) {
	const { t } = useTranslation();
	const history = useHistory();
	const [activeApp, setActiveApp] = useState(undefined);
	const [appsCache, appsLoaded] = useAppsCache();
	const [mainMenuItems, setMainMenuItems] = useState({});

	const menuTree = [
		{
			label: t('Logout'),
			icon: 'LogOut',
			folders: [],
			click: () => {}
		}
	];

	useEffect(() => {
		const subscriptions = map(appsCache, (app) => {
			return app.mainMenuItems.subscribe((menuItems) => {
				setMainMenuItems(
					reduce(
						menuItems,
						(r, menuItem, k) => {
							r[menuItem.id] = {
								id: menuItem.id,
								label: menuItem.label,
								icon: menuItem.icon || '',
								click: () => {
									setActiveApp(menuItem.id);
									history.push(getAppLinkObj(menuItem.to, app.pkg));
								},
								items: getFolderStructures(menuItem.children, app, history),
								to: menuItem.to,
								pkgName: app.pkg.package,
								allTos: collectAllTo(app.pkg.package, menuItem)
							};
							return r;
						},
						{}
					)
				);
			});
		});
		return () => {
			subscriptions.forEach((subscription) => {
				subscription.unsubscribe();
			});
		}
	}, [appsCache]);

	return (
		<Container
			orientation="horizontal"
			background="gray5"
			width="fit"
			height="fill"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
		>
			<Responsive mode="desktop">
				<Container
					width={48}
					height="fill"
					background="gray6"
					orientation="vertical"
					mainAlignment="flex-start"
					style={{
						maxHeight: 'calc(100vh - 48px)',
						overflowY: 'auto'
					}}
				>
					{ map(mainMenuItems, (app, key) =>
						<AppIcon
							key={key}
							iconColor={activeApp === app.id ? 'primary' : 'text'}
							active={activeApp === app.id}
							icon={app.icon}
							onClick={app.click}
							size="large"
						/>
					)}
				</Container>
				<Collapse
					orientation="horizontal"
					open={navigationBarIsOpen}
					maxSize="256px"
				>
					<Container
						width={256}
						height="fill"
						orientation="vertical"
						mainAlignment="flex-start"
						style={{
							maxHeight: 'calc(100vh - 48px)',
							overflowY: 'auto'
						}}
					>
						<Switch>
							{ map(mainMenuItems,
								(menuItem) => (
									<Route key={`/${menuItem.pkgName}${menuItem.to}`} exact path={menuItem.allTos}>
										{ menuItem.items.map((folder, index) =>
											<Accordion
												key={index}
												click={folder.click}
												icon={folder.icon}
												label={folder.label}
												items={folder.items || []}
											/>
										)}
									</Route>
								)
							)}
						</Switch>
					</Container>
				</Collapse>
				<Collapser clickCallback={onCollapserClick}/>
			</Responsive>
			<Responsive mode="mobile">
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
					<Collapse
						orientation="horizontal"
						open={navigationBarIsOpen}
						crossSize="100%"
					>
						<Container
							width={256+48+12}
							height="fill"
							orientation="vertical"
							mainAlignment="space-between"
							style={{
								maxHeight: 'calc(100vh - 48px)',
								overflowY: 'auto'
							}}
						>
							<Container
								width="fill"
								height="fit"
								orientation="vertical"
								mainAlignment="space-between"
							>
								{
									map(mainMenuItems, (app, key) =>
										<Accordion
											key={key}
											level={0}
											icon={app.icon}
											label={app.label}
											click={app.click}
											items={app.items}
											divider={true}
										/>
									)
								}
							</Container>
							<Container
								width="fill"
								height="fit"
								orientation="vertical"
								mainAlignment="flex-end"
							>
								{
									menuTree.map((app, index) =>
										<Accordion
											key={index}
											level={0}
											icon={app.icon}
											click={app.click}
											label={app.label}
											items={app.folders}
											divider={true}
										/>
									)
								}
								<Padding vertical="medium">
									<Quota fill={50}/>
								</Padding>
							</Container>
						</Container>
					</Collapse>
				</Container>
			</Responsive>
		</Container>
	);
}
