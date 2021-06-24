/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import React, { useContext, useEffect, useMemo } from 'react';
import { Route, Router, useHistory } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import styled from 'styled-components';
import { map } from 'lodash';
import AppContextProvider from '../../app/app-context-provider';
import { BoardValueContext, BoardSetterContext } from './board-context';
import { useApps } from '../../app-store/hooks';

// eslint-disable-next-line
const _container = styled.div`
	display: ${(props) => (props.show ? 'block' : 'none')};
	height: 100%;
	width: 100%;
	overflow-y: auto;
`;

export default function AppBoard({ idx }) {
	const { boards, currentBoard } = useContext(BoardValueContext);
	const { updateBoard } = useContext(BoardSetterContext);
	const apps = useApps();
	const windowHistory = useHistory();
	const routes = useMemo(
		() =>
			map(apps, (app, appId) =>
				app.views?.board ? (
					<Route key={appId} path={`/${appId}`}>
						<AppContextProvider key={appId} pkg={appId}>
							<app.views.board windowHistory={windowHistory} />
						</AppContextProvider>
					</Route>
				) : null
			),
		[apps, windowHistory]
	);

	const history = useMemo(() => createMemoryHistory(), []);
	// eslint-disable-next-line
	useEffect(() => {
		return history.listen((l, a) => {
			updateBoard(idx, `${l.pathname}${l.search}${l.hash}`);
		});
	}, [history, idx, updateBoard]);

	useEffect(() => {
		const l = history.location;
		if (`${l.pathname}${l.search}${l.hash}` !== boards[idx].url) {
			history.push(boards[idx].url);
		}
	}, [history, idx, boards]);

	return (
		// eslint-disable-next-line
		<_container show={currentBoard === idx}>
			<Router key={idx} history={history}>
				{routes}
			</Router>
		</_container>
	);
}
