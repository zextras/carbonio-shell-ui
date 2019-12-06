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

import React, { FC, ReactElement, useContext, useEffect, useRef, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import {List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Collapse,
	Hidden,
	makeStyles,
	createStyles,
	Theme
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { Observable, Subscription } from 'rxjs';
import RouterContext from './RouterContext';
import { map, forEach } from 'lodash';
import { IMainMenuItemData, IMainSubMenuItemData } from './IRouterService';
import { II18nService } from '../i18n/II18nService';
import { ErrorOutline } from '@material-ui/icons';
import SidebarItem, { ISidebarItemProps } from '../ui/SidebarItem';

interface IListItemLinkProps {
	icon?: ReactElement;
	primary: string;
	to: string;
	childrenObs?: Observable<Array<IMainSubMenuItemData>>;
	drawerOpen: boolean;
}
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		barIcon: {
			minWidth: theme.spacing(3),
		}
	})
)

const ListItemLink: FC<IListItemLinkProps> = ({ icon, primary, to, childrenObs, drawerOpen }) => {
	const classes = useStyles();
	const [subFolders, setSubFolders] = useState<Array<IMainSubMenuItemData>>([]);
	const [open, setOpen] = useState(false);
	const renderLink = React.useMemo(
		() =>
			React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'innerRef' | 'to'>>(
				(itemProps, ref) => (
					// With react-router-dom@^6.0.0 use `ref` instead of `innerRef`
					// See https://github.com/ReactTraining/react-router/issues/6056
					<RouterLink to={to} {...itemProps} innerRef={ref}/>
				)
			),
		[ to ]
	);

	useEffect(
		() => {
			const childSubs: Array<Subscription> = [];
			if (childrenObs) {
				childSubs.push(
					childrenObs.subscribe((e) => setSubFolders(e))
				);
			}
			return () => {
				forEach(
					childSubs,
					(s) => s.unsubscribe()
				)
			}
		},
		[ childrenObs ]
	);

	return (
		<>
			<Hidden smDown>
				<ListItem
					button
					component={renderLink}
					onClick={(): void => setOpen(!open)}
				>
					<ListItemIcon className={classes.barIcon}>
						{icon ? icon : <ErrorOutline/>}
					</ListItemIcon>
			</ListItem>
			</Hidden>
			<Hidden mdUp>
				<ListItem
					button
					component={renderLink}
					onClick={(): void => setOpen(drawerOpen && !open)}
				>
					<ListItemIcon className={classes.barIcon}>
						{icon ? icon : <ErrorOutline/>}
					</ListItemIcon>
					{ drawerOpen && (<ListItemText primary={primary} />)}
					{ drawerOpen && subFolders && subFolders.length > 0 && (
						open ? <ExpandLess /> : <ExpandMore />
					)}
			</ListItem>
			{subFolders && subFolders.length > 0 &&
				<Collapse in={open} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{map(
							subFolders,
							(folder: ISidebarItemProps, index: number): ReactElement =>
								<SidebarItem
									id={folder.id}
									label={folder.label}
									icon={folder.icon}
									children={folder.children}
									level={1}
									to={folder.to}
									key={`main-${folder.label}-${index}`}
								/>
							)
						}
					</List>
				</Collapse>
			}
			</Hidden>
		</>
	);
};

const MainMenu: FC<{ drawerOpen: boolean }> = ({ drawerOpen }) => {
	const [ mainMenuItems, setMainMenuItems ] = useState<Array<IMainMenuItemData>>([]);
	const routerCtx = useContext(RouterContext);
	const mainMenuItemsSubRef = useRef<Subscription>();

	useEffect(() => {
		mainMenuItemsSubRef.current = routerCtx.mainMenuItems.subscribe(setMainMenuItems);

		return (): void => {
			if (mainMenuItemsSubRef.current) {
				mainMenuItemsSubRef.current.unsubscribe();
				mainMenuItemsSubRef.current = undefined;
			}
		};
	}, [ routerCtx.mainMenuItems ]);

	const menuItems = map(
		mainMenuItems,
		(v) => (
			<ListItemLink
				key={v.to}
				to={v.to}
				primary={v.label}
				icon={v.icon}
				childrenObs={v.children}
				drawerOpen={drawerOpen}
			/>
		)
	);

	return (
		<List>
			{menuItems}
		</List>
	);
};
export default MainMenu;
