/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	Container,
	Divider,
	IconButton,
	Padding,
	Row,
	Tooltip
} from '@zextras/carbonio-design-system';
import { isEmpty, map } from 'lodash';
import React, { CSSProperties, useRef } from 'react';
import styled, { css, SimpleInterpolation } from 'styled-components';
import {
	closeAllBoards,
	expandBoards,
	minimizeBoards,
	onGoToPanel,
	reduceBoards,
	useBoardStore
} from '../../store/boards';
import { getT } from '../../store/i18n';
import { AppBoard } from './board';
import { TabsList } from './board-tab-list';
import { ResizableContainer } from './resizable-container';
import {
	BOARD_HEADER_HEIGHT,
	BOARD_TAB_WIDTH,
	HEADER_BAR_HEIGHT,
	LOCAL_STORAGE_BOARD_SIZE,
	PRIMARY_BAR_WIDTH
} from '../../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SizeAndPosition } from '../hooks/useResize';

export const BOARD_DEFAULT_POSITION: Pick<CSSProperties, 'top' | 'left' | 'right' | 'bottom'> = {
	left: '1.5rem',
	bottom: '0'
};

const BoardContainerComp = styled.div<{ expanded: boolean; minimized: boolean }>`
	position: fixed;
	top: ${HEADER_BAR_HEIGHT};
	bottom: 0;
	left: ${PRIMARY_BAR_WIDTH};
	right: 0;
	background-color: rgba(0, 0, 0, 0);
	pointer-events: none;
	z-index: 10;
	${({ expanded }): SimpleInterpolation =>
		expanded &&
		css`
			background-color: rgba(0, 0, 0, 0.5);
			pointer-events: auto;
		`}
	${({ minimized }): SimpleInterpolation =>
		minimized &&
		css`
			display: none;
		`}
`;

const Board = styled(Container)<{ expanded: boolean }>`
	z-index: 5;
	position: absolute;
	${BOARD_DEFAULT_POSITION};

	${({ width }): SimpleInterpolation =>
		!width &&
		css`
			/* default width and aspect ratio */
			aspect-ratio: 4 / 3;
			width: auto;
		`}

	${({ height }): SimpleInterpolation =>
		!height &&
		css`
			/* default height */
			height: 70vh;
			/* on higher screen, reduce the default height */
			@media (min-height: 800px) {
				height: 60vh;
			}
			@media (min-height: 1000px) {
				height: 50vh;
			}
		`}

	min-height: calc(${BOARD_HEADER_HEIGHT} * 3);
	min-width: calc(${BOARD_TAB_WIDTH} * 2);
	box-shadow: 0 0.125rem 0.3125rem 0 rgba(125, 125, 125, 0.5);
	pointer-events: auto;
	max-height: 100%;
	max-width: 100%;
	${({ expanded }): SimpleInterpolation =>
		expanded &&
		css`
			height: calc(100% - 1.5rem) !important;
			width: calc(100% - 3rem) !important;
			top: 1.5rem !important;
			left: 1.5rem !important;
			min-height: auto;
		`};
`;

const BoardHeader = styled(Row)`
	position: relative;
`;

const BoardDetailContainer = styled(Row)`
	min-height: 0;
`;
const BackButton = styled(IconButton)``;
const Actions = styled(Row)``;

export const BoardContainer = (): JSX.Element | null => {
	const t = getT();
	const { boards, minimized, expanded, current } = useBoardStore();
	const boardRef = useRef<HTMLDivElement>(null);
	const boardContainerRef = useRef<HTMLDivElement>(null);
	const [lastBoardSize] = useLocalStorage<Partial<SizeAndPosition> | undefined>(
		LOCAL_STORAGE_BOARD_SIZE,
		undefined
	);

	if (isEmpty(boards) || !current) {
		return null;
	}

	return (
		<BoardContainerComp expanded={expanded} minimized={minimized} ref={boardContainerRef}>
			<Board
				data-testid="NewItemContainer"
				background={'gray6'}
				crossAlignment="unset"
				expanded={expanded}
				ref={boardRef}
				width={lastBoardSize?.width}
				height={lastBoardSize?.height}
			>
				<ResizableContainer
					crossAlignment={'unset'}
					elementToResize={boardRef}
					localStorageKey={LOCAL_STORAGE_BOARD_SIZE}
					disabled={expanded}
				>
					<BoardHeader background={'gray5'}>
						<Padding all="extrasmall">
							<Tooltip label={t('board.hide', 'Hide board')} placement="top">
								<BackButton icon="BoardCollapseOutline" onClick={minimizeBoards} />
							</Tooltip>
						</Padding>
						<TabsList />
						<Actions padding={{ all: 'extrasmall' }}>
							{boards[current]?.context?.onReturnToApp && (
								<Padding right="extrasmall">
									<Tooltip label={t('board.open_app', 'Open in app')} placement="top">
										<IconButton icon={'DiagonalArrowRightUp'} onClick={onGoToPanel} />
									</Tooltip>
								</Padding>
							)}
							<Padding right="extrasmall">
								<Tooltip
									label={
										expanded
											? t('board.reduce', 'Reduce board')
											: t('board.enlarge', 'Enlarge board')
									}
									placement="top"
								>
									<IconButton
										icon={expanded ? 'CollapseOutline' : 'ExpandOutline'}
										onClick={expanded ? reduceBoards : expandBoards}
									/>
								</Tooltip>
							</Padding>
							<Tooltip label={t('board.close_tabs', 'Close all your tabs')} placement="top">
								<IconButton icon="CloseOutline" onClick={closeAllBoards} />
							</Tooltip>
						</Actions>
					</BoardHeader>
					<Divider style={{ height: '0.125rem' }} />
					<BoardDetailContainer takeAvailableSpace>
						{map(boards, (b) => (
							<AppBoard key={b.id} board={b} />
						))}
					</BoardDetailContainer>
				</ResizableContainer>
			</Board>
		</BoardContainerComp>
	);
};
