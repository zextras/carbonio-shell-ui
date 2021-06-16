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

import React, { useMemo } from 'react';
import { map, reduce, endsWith } from 'lodash';
import { useHistory } from 'react-router-dom';
import { Container, Responsive } from '@zextras/zapp-ui';
import ShellPrimaryBar from './shell-primary-bar';
import ShellSecondaryBar from './shell-secondary-bar';
import ShellMobileNav from './shell-mobile-nav';

function collectAllTo(pkgName, { to, items }) {
	return reduce(items || [], (r, v) => [...r, ...collectAllTo(pkgName, v)], [`/${pkgName}${to}`]);
}

const HAS_SEARCH_REG = /\?/;

function getAppLink(to, pkg) {
	if (typeof to === 'string') {
		let urlTo = '';
		let urlSearch = '';
		if (HAS_SEARCH_REG.test(to)) {
			[urlTo, urlSearch] = to.split('?');
		} else {
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
				history.push(getAppLink(folder.to, app.pkg));
			}
		},
		active: history.location.pathname === `/${app.pkg.package}${folder.to}`,
		items: getFolderStructures(folder.items, app, history)
	}));
}

const setActiveItem = (menuItems, pathname) =>
	map(menuItems, (item) => ({
		...item,
		active: endsWith(pathname, item.to),
		items: setActiveItem(item.items, pathname)
	}));

export default function ShellNavigationBar({
	navigationBarIsOpen,
	mobileNavIsOpen,
	onCollapserClick,
	quota
}) {
	const history = useHistory();
	const activeApp = useMemo(() => history.location.pathname.split('/')[1], [
		history.location.pathname
	]);
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
				<ShellPrimaryBar activeApp={activeApp} />
				<ShellSecondaryBar
					navigationBarIsOpen={navigationBarIsOpen}
					onCollapserClick={onCollapserClick}
					activeApp={activeApp}
				/>
			</Responsive>
			<Responsive mode="mobile">
				<ShellMobileNav mobileNavIsOpen={mobileNavIsOpen} quota={quota} activeApp={activeApp} />
			</Responsive>
		</Container>
	);
}
