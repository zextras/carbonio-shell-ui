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
import { Header } from '@zextras/zapp-ui';
import RouterContext from '../router/RouterContext';
import useObservable from '../hooks/useObservable';
import { forEach } from 'lodash';
import { useHistory } from 'react-router-dom'

export default function ShellHeader({
	navigationBarIsOpen,
	onMenuClick,
	onUserClick,
	userBarIsOpen,
}) {
	const history = useHistory();
	const routerCtx = useContext(RouterContext);
	const registeredCreateActions = useObservable(routerCtx.createMenuItems);
	const [createActions, setCreateActions] = useState([]);
	useEffect(() => {
		const newCreateActions = [];
		forEach(registeredCreateActions, (action, index) => {
			newCreateActions.push({
				id: `${index}-${action.label}`,
				label: action.label,
				icon: action.icon,
				click: () => history.push(action.to)
			});
		});
		setCreateActions(newCreateActions);
	}, [registeredCreateActions, history]);

	return (
		<Header
			navigationBarIsOpen={navigationBarIsOpen}
			onMenuClick={onMenuClick}
			onUserClick={onUserClick}
			quota={50}
			userBarIsOpen={userBarIsOpen}
			createItems={createActions}
		/>
	)
}
