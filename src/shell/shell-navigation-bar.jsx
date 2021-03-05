/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { useEffect, useState, useMemo } from 'react';
import { combineLatest } from 'rxjs';
import { map as rxMap } from 'rxjs/operators';
import { map, reduce, endsWith } from 'lodash';
import { useHistory } from 'react-router-dom';
import { Container, Responsive } from '@zextras/zapp-ui';
import { useAppsCache } from '../app/app-loader-context';
import ShellPrimaryBar from './shell-primary-bar';
import ShellSecondaryBar from './shell-secondary-bar';
import ShellMobileNav from './shell-mobile-nav';
import { useSettingsApps } from '../settings/settings-app';

function collectAllTo(pkgName, { to, items }) {
	return reduce(
		items || [],
		(r, v) => ([...r, ...collectAllTo(pkgName, v)]),
		[`/${pkgName}${to}`]
	);
}

const HAS_SEARCH_REG = /\?/;

function getAppLink(to, pkg) {
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
	return { ...to, pathname: `/${pkg.package}${to.pathname}` };
}

function getFolderStructures(folders, app, history) {
	return map(folders, (folder) => ({
		...folder,
		onClick: (ev) => {
			if (folder.onClick) {
				folder.onClick(ev);
			}
			if (folder.to) {
				history.push(getAppLink(folder.to, app.pkg))
			}
		},
		active: history.location.pathname === `/${app.pkg.package}${folder.to}`,
		items: getFolderStructures(folder.items, app, history)
	}));
}

const setActiveItem = (menuItems, pathname) => map(
	menuItems,
	(item) => ({
		...item,
		active: endsWith(pathname, item.to),
		items: setActiveItem(item.items, pathname)
	})
);

export default function ShellNavigationBar({
	navigationBarIsOpen,
	mobileNavIsOpen,
	onCollapserClick,
	userMenuTree,
	quota
}) {
	const history = useHistory();
	const [activeApp, setActiveApp] = useState(undefined);
	const { cache } = useAppsCache();
	const [_mainMenuItems, setMainMenuItems] = useState({});
	const settingsApp = useSettingsApps(setActiveApp, history);

	const mainMenuItems = useMemo(
		() => setActiveItem({..._mainMenuItems, settingsApp }, history.location.pathname),
		[_mainMenuItems, history.location.pathname, settingsApp]
	);

	useEffect(() => {
		const subscription = combineLatest(
			reduce(
				cache,
				(acc, app) => {
					acc.push(
						app.mainMenuItems.pipe(
							rxMap((items) => ({ items, app }))
						)
					);
					return acc;
				},
				[]
			)
		)
			.subscribe((appItems) => {
				setMainMenuItems(
					reduce(
						appItems,
						(acc, { items, app }) => {
							reduce(
								items,
								(r, menuItem) => {
									r[menuItem.id] = {
										id: menuItem.id,
										label: menuItem.label,
										icon: menuItem.icon || '',
										click: () => {
											setActiveApp(menuItem.id);
											history.push(getAppLink(menuItem.to, app.pkg));
										},
										customComponent: menuItem.customComponent,
										items: getFolderStructures(menuItem.items, app, history),
										to: menuItem.to,
										pkgName: app.pkg.package,
										allTos: collectAllTo(app.pkg.package, menuItem)
									};
									return r;
								},
								acc
							);
							return acc;
						},
						{}
					)
				);
			});

		return () => {
			if (subscription) {
				subscription.unsubscribe();
			}
		};
	}, [cache, setMainMenuItems, history]);

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
				<ShellPrimaryBar
					mainMenuItems={mainMenuItems}
					activeApp={activeApp}
				/>
				<ShellSecondaryBar
					navigationBarIsOpen={navigationBarIsOpen}
					mainMenuItems={mainMenuItems}
					onCollapserClick={onCollapserClick}
				/>
			</Responsive>
			<Responsive mode="mobile">
				<ShellMobileNav
					mobileNavIsOpen={mobileNavIsOpen}
					mainMenuItems={mainMenuItems}
					menuTree={userMenuTree}
					quota={quota}
				/>
			</Responsive>
		</Container>
	);
}
