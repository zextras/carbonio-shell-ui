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
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import styled from 'styled-components';
import { reduce } from 'lodash';
import { useAppsCache } from '../../app/app-loader-context';
import AppPanelRoutes from '../../app/app-panel-routes';
import ShellContext from '../shell-context';

const _container = styled.div`
	display: ${(props) => props.show ? 'block' : 'none'};
	height: 100%;
	width: 100%;
	overflow-y: auto;
`;

export default function AppPanel({ idx }) {
	const {
		currentPanel,
		panels,
		updatePanel
	} = useContext(ShellContext);
	const [appsCache, appsLoaded] = useAppsCache();
	const [children, setChildren] = useState([]);

	useEffect(() => {
		const childrn = reduce(
			appsCache,
			(r, v, k) => {
				r.push((
					<AppPanelRoutes key={k} app={v} />
				));
				return r;
			},
			[]
		);
		setChildren(childrn);
	}, [appsCache, appsLoaded, setChildren]);

	const history = useMemo(() => createMemoryHistory(), []);

	useEffect(() => {
		return history.listen((l, a) => {
			updatePanel(idx, `${l.pathname}${l.search}${l.hash}`);
		});
	}, [history, idx, updatePanel]);

	useEffect(() => {
		const l = history.location;
		if (`${l.pathname}${l.search}${l.hash}` !== panels[idx]) {
			history.push(panels[idx]);
		}
	}, [history, idx, panels]);

	return (
		<_container show={currentPanel === idx}>
			<Router key={panels[idx] + idx} history={history}>
				{ children }
			</Router>
		</_container>
	);
}
