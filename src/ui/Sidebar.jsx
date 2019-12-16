/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2019 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, {
	useContext,
	useState,
	useEffect
} from 'react';
import { map, find } from "lodash";
import clsx from 'clsx';
import {
	List,
	Paper,
	Grid
} from '@material-ui/core';
import RouterContext from '../router/RouterContext';
import SidebarItem from './SidebarItem';
import I18nContext from '../i18n/I18nContext';
import useStyles from './Sidebar.jss';
import { useObservable } from '../utils/useObservable';

const Sidebar = () => {
	const { t } = useContext(I18nContext);
	const { currentRoute, mainMenuItems } = useContext(RouterContext);
	const currentApp = useObservable(currentRoute);
	const menuItems = useObservable(mainMenuItems);
	const [children, setChildren] = useState();
	useEffect(
		() => {
			let childrenSub;
			if (menuItems && currentApp) {
				const currentAppData = find(menuItems, (item) => item.app === currentApp);
				if (currentAppData && currentAppData.children) {
					childrenSub = currentAppData.children.subscribe(setChildren);
				}
			}
			return () => {
				if (childrenSub) {
					childrenSub.unsubscribe();
					setChildren(undefined);
				}
			};
		}, [currentApp, menuItems]
	);
	const classes = useStyles();
	const [open, setOpen] = useState(true);
	const [hidden, setHidden] = useState(false);
	const handleClick = () => {
		setOpen(!open);
	};

	const handleKeyPress = (ev) => {
		if (!(ev.ctrlKey || ev.altKey || ev.shiftKey || ev.metaKey)) {
			switch (ev.key) {
				case 'b':
					setHidden(!hidden);
					ev.stopPropagation();
					break;
				default: break;
			}
		}
	};

	return (
		<Grid
			className={classes.fullHeight}
			container
			direction="row"
			justify="flex-start"
			alignItems="stretch"
		>
			{
				children && children.length > 0 &&
				<Paper
					className={classes.listWrapper}
				>
					<List
						component="nav"
						className={clsx(classes.list, {
							[classes.listOpen]: !hidden,
							[classes.listClose]: hidden,
						})}
					>
					{map(
						children,
						(folder, index) => (
							<SidebarItem
								{ ...folder }
								key={`secondary-${folder.label}-${index}`}
								level={1}/>
							)
					)}
					</List>
					<div
						aria-label="Open Sidebar"
						tabIndex={0}
						role="button"
						className={classes.barOpener}
						onClick={() => setHidden(!hidden)}
						onKeyUp={handleKeyPress}
					>
						<div className={classes.barOpenerNotch}/>
					</div>
				</Paper>
			}
		</Grid>
	);
};
export default Sidebar;
