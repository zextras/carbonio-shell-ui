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

import React from 'react';
import { useBehaviorSubject } from '../shell/hooks';
import { reduce } from 'lodash';
import { useIsMobile } from '../shell/shell-context-provider';
import AppMainMenuItemChild from './app-main-menu-item-child';
import AppContextProvider from './app-context-provider';
import AppLink from './app-link';

export default function AppMainMenuItems({ app }) {
	const isMobile = useIsMobile();
	const menuItems = useBehaviorSubject(app.mainMenuItems);
	const children = [];
	reduce(
		menuItems,
		(r, v, k) => {
			const subChildren = [];
			if (isMobile && v.children) {
				reduce(
					v.children,
					(r, v, k) => {
						r.push((
							<AppMainMenuItemChild key={v.id} pkg={app.pkg} data={v} />
						));
						return r;
					},
					subChildren
				);
			}
			r.push((
				<li key={v.id}>
					<AppContextProvider pkg={app.pkg}>
						{v.icon} <AppLink to={v.to}>{ v.label }</AppLink>
					</AppContextProvider>
					{ subChildren.length > 0 && <ul>
						{ subChildren }
					</ul> }
				</li>
			));
			return r;
		},
		children
	);
	return (
		<>
			{ children }
		</>
	);
}

