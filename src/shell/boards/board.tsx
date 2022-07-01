/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useEffect, useMemo } from 'react';
import { Route, Router, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { find } from 'lodash';
import { createMemoryHistory } from 'history';
import AppContextProvider from '../../boot/app/app-context-provider';
import { useAppStore } from '../../store/app';
import { updateBoard, useBoard, useBoardStore } from '../../store/boards';

const BoardContainer = styled.div<{ show: boolean }>`
	display: ${(props): string => (props.show ? 'block' : 'none')};
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
		background-color: ${({ theme }): string => theme.palette.gray3.regular};
		border-radius: 4px;
	}
`;

export const AppBoard: FC<{ id: string }> = ({ id }) => {
	const board = useBoard(id);
	const current = useBoardStore((s) => s.current);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const history = useMemo(() => createMemoryHistory({ initialEntries: [board.url] }), []);
	const boardViews = useAppStore((s) => s.views.board);
	const windowHistory = useHistory();
	const route = useMemo(() => {
		const view = find(boardViews, (v) => v.route.startsWith(board.url));
		if (view)
			return (
				<Route key={view.id} path={`/${view.route}`}>
					<AppContextProvider key={view.id} pkg={view.app}>
						<view.component windowHistory={windowHistory} />
					</AppContextProvider>
				</Route>
			);
		return null;
	}, [board.url, boardViews, windowHistory]);

	useEffect(() => {
		const unlisten = history.listen(({ location }) => {
			if (`${location.pathname}${location.search}${location.hash}` !== board.url) {
				updateBoard(id, { url: `${location.pathname}${location.search}${location.hash}` });
			}
		});
		return () => {
			unlisten();
		};
	}, [board, history, id]);

	useEffect(() => {
		const l = history.location;
		if (`${l.pathname}${l.search}${l.hash}` !== board.url) {
			history.push(board.url);
		}
	}, [id, board, history]);

	return (
		<BoardContainer show={current === id}>
			<Router history={history}>{route}</Router>
		</BoardContainer>
	);
};
