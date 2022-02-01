/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useContext, useEffect, useMemo } from 'react';
import { Route, Router, useHistory } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import styled from 'styled-components';
import { map } from 'lodash';
import AppContextProvider from '../../boot/app/app-context-provider';
import { BoardValueContext, BoardSetterContext } from './board-context';
import { useAppStore } from '../../store/app';

const BoardContainer = styled.div`
	display: ${(props) => (props.show ? 'block' : 'none')};
	height: 100%;
	width: 100%;
	overflow-y: auto;
`;
const history = createMemoryHistory();

export default function AppBoard({ idx }) {
	const { boards, currentBoard } = useContext(BoardValueContext);
	const { updateBoard } = useContext(BoardSetterContext);
	const boardViews = useAppStore((s) => s.views.board);
	const windowHistory = useHistory();
	const routes = useMemo(
		() =>
			map(boardViews, (view) => (
				<Route key={view.id} path={`/${view.route}`}>
					<AppContextProvider key={view.id} pkg={view.app}>
						<view.component windowHistory={windowHistory} />
					</AppContextProvider>
				</Route>
			)),
		[boardViews, windowHistory]
	);

	useEffect(
		() =>
			history.listen((l, a) => {
				updateBoard(idx, `${l.pathname}${l.search}${l.hash}`);
			}),
		[idx, updateBoard]
	);

	useEffect(() => {
		const l = history.location;
		if (`${l.pathname}${l.search}${l.hash}` !== boards[idx].url) {
			history.push(boards[idx].url);
		}
	}, [idx, boards]);

	return (
		<BoardContainer show={currentBoard === idx}>
			<Router key={idx} history={history}>
				{routes}
			</Router>
		</BoardContainer>
	);
}
