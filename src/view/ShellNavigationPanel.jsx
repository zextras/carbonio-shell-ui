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

import React, { useContext, useEffect, useState } from 'react';
import { NavigationPanel } from '@zextras/zapp-ui';
import RouterContext from '../router/RouterContext';
import useObservable from '../hooks/useObservable';
import { forEach } from 'lodash';
import { useHistory } from 'react-router-dom'

function buildTree(folders, history) {
	if (folders && folders.length > 0) {
		const newFolders = [];
		forEach(folders, folder => {
			newFolders.push({
				label: folder.label,
				click: () => history.push(folder.to),
				icon: folder.icon,
				subfolders: buildTree(folder.children, history)
			});
		});
		return newFolders;
	} else return [];
}

export default function ShellNavigationPanel({
	navigationBarIsOpen,
	menuTree,
	onCollapserClick,
	quota
}) {
	const routerCtx = useContext(RouterContext);
	const currentApp = useObservable(routerCtx.currentRoute);
	const mainMenuItems = useObservable(routerCtx.mainMenuItems);
	const history = useHistory();
	const [navTree, setNavTree] = useState([]);

	useEffect(() => {
		const newNavTree = [];
		forEach(mainMenuItems, item => {
			newNavTree.push({
				app: item.app,
				label: item.label,
				icon: item.icon,
				click: () => history.push(item.to),
				folders: buildTree(item.children, history)
			});
		});
		setNavTree(newNavTree);
	}, [history, mainMenuItems]);

	return (
		<NavigationPanel
			navigationBarIsOpen={navigationBarIsOpen}
			menuTree={menuTree}
			onCollapserClick={onCollapserClick}
			tree={navTree}
			quota={quota}
			selectedApp={currentApp}
		/>
	)
}

/*
					navigationBarIsOpen={navOpen}
					menuTree={menuTree}
					onCollapserClick={() => setNavOpen(!navOpen)}
					tree={navTree}
					quota={50}
 */
