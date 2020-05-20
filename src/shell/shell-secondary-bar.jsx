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
import styled from 'styled-components';
import { reduce } from 'lodash';
import { Route, Switch } from 'react-router-dom';
import { useIsMobile } from './shell-context';
import { useAppsCache } from '../app/app-loader-context';
import { useBehaviorSubject } from './hooks';
import AppMainMenuItemChild from '../app/app-main-menu-item-child';

const Container = styled.div`
	width: 300px;
	background-color: #9a6e3a;
`;

export function collectAllTo(pkgName, { to, children }) {
	return reduce(
		children || [],
		(r, v, k) => {
			return [...r, ...collectAllTo(pkgName, v)];
		},
		[`/${pkgName}${to}`]
	);
}

function AppSecondaryContent({ app }) {
	const menuItems = useBehaviorSubject(app.mainMenuItems);
	const children = reduce(
		menuItems,
		(r, v, k) => {
			const subChildren = reduce(
				v.children || [],
				(r1, v1, k1) => {
					r1.push((
						<AppMainMenuItemChild key={v1.id} pkg={app.pkg} data={v1} />
					));
					return r1;
				},
				[]
			);
			const allTos = collectAllTo(app.pkg.package, v);
			r.push((
				<Route key={`/${app.pkg.package}${v.to}`} exact path={allTos}>
					{ subChildren.length > 0 && <ul>
						{ subChildren }
					</ul> }
				</Route>
			));
			return r;
		},
		[]
	);
	return (
		<>
			{ children }
		</>
	);
}

export default function ShellSecondaryBar() {
	const isMobile = useIsMobile();
	const [appsCache, appsLoaded] = useAppsCache();
	const [children, setChildren] = useState([]);

	useEffect(() => {
		const childrn = reduce(
			appsCache,
			(r, v, k) => {
				r.push((
					<AppSecondaryContent key={v.pkg.package} app={v} />
				));
				return r;
			},
			[]
		);
		setChildren(childrn);
	}, [appsCache, appsLoaded, setChildren]);

	if (isMobile || children.length <= 0) return null;
	return (
		<Container>
			<Switch>
				{ children }
			</Switch>
		</Container>
	);
}
