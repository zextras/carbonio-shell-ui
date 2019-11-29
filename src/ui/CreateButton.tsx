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

import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import RouterContext from '../router/RouterContext';
import {
	Button,
	ButtonGroup,
	ClickAwayListener,
	Grid,
	Grow,
	MenuItem,
	MenuList,
	Paper,
	Popper
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { ICreateMenuItemData } from '../router/IRouterService';
import { map, filter, find } from 'lodash';
import { useHistory } from 'react-router-dom';
import I18nContextProvider from '../i18n/I18nContextProvider';
import { II18nService } from '../i18n/II18nService';

export const CreateButton: FC<{ i18nSrvc: II18nService}> = ({ i18nSrvc }) => {
	const routerCtxt = useContext(RouterContext);
	const [open, setOpen] = useState(false);
	const [createItems, setCreateItems] = useState<Array<ICreateMenuItemData>>([]);
	const [currentApp, setCurrentApp] = useState<string>('');
	const anchorRef = useRef<HTMLDivElement>(null);
	const history = useHistory();

	useEffect(() => {
		const miSub = routerCtxt.createMenuItems.subscribe((itms) => setCreateItems(itms));
		const caSub = routerCtxt.currentRoute.subscribe((r) => setCurrentApp(r));

		return () => {
			miSub.unsubscribe();
			caSub.unsubscribe();
		};
	},[routerCtxt]);

	const currentAppCreateItem = find(
		createItems,
		(i) => i.app === currentApp
	);

	const handleClick = () => {
		if (currentAppCreateItem)
			history.push(currentAppCreateItem.to);
	};

	const handleMenuItemClick = (
		event: React.MouseEvent<HTMLLIElement, MouseEvent>,
		ci: ICreateMenuItemData,
	) => {
		setOpen(false);
		history.push(ci.to);
	};

	const handleToggle = () => {
		setOpen(prevOpen => !prevOpen);
	};

	const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
		if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
			return;
		}
		setOpen(false);
	};

	return (
		<Grid container direction="column" alignItems="center">
			<Grid item xs={12}>
				<ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
					{ (currentAppCreateItem) ?
						<I18nContextProvider i18nService={i18nSrvc} namespace={currentAppCreateItem.app}>
							<Button onClick={handleClick}>{currentAppCreateItem.label}</Button>
						</I18nContextProvider>
						:
						<Button disabled={true}>New</Button>
					}
					{ (createItems.length > 1 || !currentAppCreateItem) ?
						(
							<Button
								color="primary"
								size="small"
								aria-controls={open ? 'split-button-menu' : undefined}
								aria-expanded={open ? 'true' : undefined}
								aria-label="select an action"
								aria-haspopup="menu"
								onClick={handleToggle}
							>
								<ArrowDropDownIcon />
							</Button>
						)
						:
						null
					}
				</ButtonGroup>
				<Popper open={ open } anchorEl={ anchorRef.current } role={ undefined } transition disablePortal>
					{ ({ TransitionProps, placement }) => (
						<Grow
							{ ...TransitionProps }
							style={ {
								transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
							} }
						>
							<Paper>
								<ClickAwayListener onClickAway={ handleClose }>
									<MenuList id="split-button-menu">
										{
											map(
												filter(
													createItems,
													(ci) => ci.app !== currentApp
												),
												(ci) => (
													<MenuItem
														key={ ci.app }
														onClick={ event => handleMenuItemClick(event, ci) }
													>
														<I18nContextProvider i18nService={i18nSrvc} namespace={ci.app}>
															{ ci.label }
														</I18nContextProvider>
													</MenuItem>
												)
											)
										}
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					) }
				</Popper>
			</Grid>
		</Grid>
	);
};
