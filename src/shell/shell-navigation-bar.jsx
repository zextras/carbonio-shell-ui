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

import React, { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { map as rxMap } from 'rxjs/operators';
import { map, reduce } from 'lodash';
import { useHistory } from 'react-router-dom';
import {
	Container,
	Responsive
} from '@zextras/zapp-ui';
import { useAppsCache } from '../app/app-loader-context';
import ShellPrimaryBar from './shell-primary-bar';
import ShellSecondaryBar from './shell-secondary-bar';
import ShellMobileNav from './shell-mobile-nav';

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
function getAppLink( to, pkg ) {
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
	return map(folders, (folder) => {
		const _folderObj = {
			id: folder.id,
			label: folder.label,
			click: () => history.push(getAppLink(folder.to, app.pkg))
		};
		if (folder.icon) _folderObj.icon = folder.icon;
		if (folder.children) _folderObj.items = getFolderStructures(folder.children, app, history);
		return _folderObj;
	});
}

export default function ShellNavigationBar({
	navigationBarIsOpen,
	mobileNavIsOpen,
	onCollapserClick,
	userMenuTree,
	quota
}) {
	const history = useHistory();
	const [activeApp, setActiveApp] = useState(undefined);
	const [appsCache, appsLoaded] = useAppsCache();
	const [mainMenuItems, setMainMenuItems] = useState({});

	useEffect(() => {
		const subscription = combineLatest(
			reduce(
				appsCache,
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
								(r, menuItem, k) => {
									r[menuItem.id] = {
										id: menuItem.id,
										label: menuItem.label,
										icon: menuItem.icon || '',
										click: () => {
											setActiveApp(menuItem.id);
											history.push(getAppLink(menuItem.to, app.pkg));
										},
										items: getFolderStructures(menuItem.children, app, history),
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
	}, [appsCache, setMainMenuItems, history]);

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
