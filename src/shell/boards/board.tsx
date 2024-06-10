/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';

import { find } from 'lodash';
import styled from 'styled-components';

import AppContextProvider from '../../boot/app/app-context-provider';
import { useAppStore } from '../../store/app';
import { BoardProvider, useBoardStore } from '../../store/boards';
import type { Board } from '../../types/boards';

const BoardContainer = styled.div<{ show: boolean }>`
	display: ${(props): string => (props.show ? 'block' : 'none')};
	height: 100%;
	width: 100%;
	overflow-y: auto;
	&::-webkit-scrollbar {
		width: 0.5rem;
	}

	&::-webkit-scrollbar-track {
		background-color: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }): string => theme.palette.gray3.regular};
		border-radius: 0.25rem;
	}
`;

export const AppBoard = ({ board }: { board: Board }): React.JSX.Element => {
	const current = useBoardStore((s) => s.current);
	const boardViews = useAppStore((s) => s.views.board);
	const boardView = useMemo(() => {
		const view = find(boardViews, (v) => v.id === board.boardViewId);
		if (view)
			return (
				<AppContextProvider key={view.id} pkg={view.app}>
					<BoardProvider id={board.id}>
						<view.component />
					</BoardProvider>
				</AppContextProvider>
			);
		return null;
	}, [board.boardViewId, board.id, boardViews]);

	return <BoardContainer show={current === board.id}>{boardView}</BoardContainer>;
};
