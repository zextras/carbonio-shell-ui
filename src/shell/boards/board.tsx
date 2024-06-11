/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';

import { Container } from '@zextras/carbonio-design-system';
import { find } from 'lodash';
import styled from 'styled-components';

import AppContextProvider from '../../boot/app/app-context-provider';
import { useAppStore } from '../../store/app';
import { BoardProvider, useBoardStore } from '../../store/boards';
import type { BoardView } from '../../types/apps';
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

const BoardViewComponent = ({
	view,
	boardId
}: {
	view: BoardView;
	boardId: string;
}): React.JSX.Element => (
	<AppContextProvider pkg={view.app}>
		<BoardProvider id={boardId}>
			<view.component />
		</BoardProvider>
	</AppContextProvider>
);

export const AppBoard = ({ board }: { board: Board }): React.JSX.Element => {
	const current = useBoardStore((s) => s.current);
	const boardViews = useAppStore((s) => s.views.board);
	const boardView = useMemo(
		() => find(boardViews, (v) => v.id === board.boardViewId),
		[board.boardViewId, boardViews]
	);

	return (
		<BoardContainer show={current === board.id}>
			{boardView ? (
				<BoardViewComponent view={boardView} boardId={board.id} />
			) : (
				<Container orientation={'row'} mainAlignment={'center'}>
					<p>Missing Board View</p>
				</Container>
			)}
		</BoardContainer>
	);
};
