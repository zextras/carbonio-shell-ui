/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Route, Router, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { map } from 'lodash';
import { createMemoryHistory } from 'history';
import AppContextProvider from '../../boot/app/app-context-provider';
import { BoardValueContext, BoardSetterContext } from './board-context';
import { useAppStore } from '../../store/app';

const BoardContainer = styled.div`
	display: ${(props) => (props.show ? 'block' : 'none')};
	height: 100%;
	width: 100%;
	overflow-y: auto;
	&::-webkit-scrollbar {
		width: 8px;
	}

	&::-webkit-scrollbar-track {
		background-color: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.palette.gray3.regular};
		border-radius: 4px;
	}
`;

export default function AppBoard({ idx }) {
	const { boards, currentBoard } = useContext(BoardValueContext);
	const [history] = useState(() => createMemoryHistory({ initialEntries: [boards[idx].url] }));
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

	useEffect(() => {
		const unlisten = history.listen(({ location }) => {
			if (`${location.pathname}${location.search}${location.hash}` !== boards[idx].url) {
				updateBoard(idx, `${location.pathname}${location.search}${location.hash}`);
			}
		});
		return () => {
			unlisten();
		};
	}, [boards, history, idx, updateBoard]);

	useEffect(() => {
		const l = history.location;
		if (`${l.pathname}${l.search}${l.hash}` !== boards[idx].url) {
			history.push(boards[idx].url);
		}
	}, [idx, boards, history]);

	return (
		<BoardContainer show={currentBoard === idx}>
			<Router history={history}>{routes}</Router>
		</BoardContainer>
	);
}
