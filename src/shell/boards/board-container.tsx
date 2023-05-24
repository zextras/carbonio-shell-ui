/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	Container,
	Divider,
	Dropdown,
	DropdownItem,
	Icon,
	IconButton,
	IconButtonProps,
	Padding,
	Row,
	Text,
	Tooltip
} from '@zextras/carbonio-design-system';
import { debounce, isEmpty, map, noop, size } from 'lodash';
import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled, { css, SimpleInterpolation } from 'styled-components';
import {
	closeAllBoards,
	closeBoard,
	expandBoards,
	minimizeBoards,
	onGoToPanel,
	reduceBoards,
	setCurrentBoard,
	useBoardStore
} from '../../store/boards';
import { getT } from '../../store/i18n';
import { AppBoard } from './board';
import { TabsList } from './board-tab-list';
import { getApp } from '../../store/app';
import { ResizableContainer } from './resizable-container';
import {
	BOARD_CONTAINER_ZINDEX,
	BOARD_HEADER_HEIGHT,
	BOARD_MIN_VISIBILITY,
	BOARD_TAB_WIDTH,
	HEADER_BAR_HEIGHT,
	LOCAL_STORAGE_BOARD_SIZE,
	PRIMARY_BAR_WIDTH
} from '../../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { setElementSizeAndPosition, SizeAndPosition } from '../../utils/utils';

export const BOARD_DEFAULT_POSITION: Pick<CSSProperties, 'top' | 'left' | 'right' | 'bottom'> = {
	left: '1.5rem',
	bottom: '0'
};

const BoardContainerComp = styled.div<{ expanded: boolean; minimized: boolean }>`
	position: fixed;
	width: calc(100vw - ${PRIMARY_BAR_WIDTH});
	height: calc(100vh - ${HEADER_BAR_HEIGHT});
	top: ${HEADER_BAR_HEIGHT};
	left: ${PRIMARY_BAR_WIDTH};
	background-color: rgba(0, 0, 0, 0);
	pointer-events: none;
	z-index: ${BOARD_CONTAINER_ZINDEX};
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

const OverflowContainer = styled(Container)`
	overflow: auto;
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
	max-width: calc(100% - ${BOARD_DEFAULT_POSITION.left});
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

interface ListItemContentProps {
	icon?: string;
	label: string;
	selected?: boolean;
	app: string;
	boardId: string;
}

function ListItemContent({
	icon,
	label,
	selected,
	app,
	boardId
}: ListItemContentProps): JSX.Element {
	const t = getT();
	const onClose = useCallback<IconButtonProps['onClick']>(
		(ev) => {
			ev.stopPropagation();
			closeBoard(boardId);
		},
		[boardId]
	);
	return (
		<Container orientation="horizontal" mainAlignment="flex-start" gap={'0.5rem'}>
			{icon && <Icon icon={icon} size={'large'} color={'text'} style={{ pointerEvents: 'none' }} />}
			<OverflowContainer crossAlignment={'flex-start'}>
				<Text size={'medium'} weight={selected ? 'bold' : 'regular'} color={'gray0'}>
					{label}
				</Text>
				<Text size={'small'} weight={selected ? 'bold' : 'regular'} color={'secondary'}>
					{t('board.from_app', 'From {{app}}', {
						app
					})}
				</Text>
			</OverflowContainer>
			<IconButton icon={'CloseOutline'} size={'large'} onClick={onClose} />
		</Container>
	);
}

export const BoardContainer = (): JSX.Element | null => {
	const t = getT();
	const { boards, minimized, expanded, current, orderedBoards } = useBoardStore();

	const boardDropdownItems = useMemo(
		(): DropdownItem[] =>
			map(
				orderedBoards,
				(boardId): DropdownItem => ({
					id: boardId,
					label: boards[boardId].title,
					icon: boards[boardId].icon,
					onClick: () => setCurrentBoard(boardId),
					selected: boardId === current,
					customComponent: (
						<ListItemContent
							label={boards[boardId].title}
							icon={boards[boardId].icon}
							selected={boardId === current}
							app={getApp(boards[boardId].app)().display}
							boardId={boardId}
						/>
					)
				})
			),
		[boards, current, orderedBoards]
	);

	const boardRef = useRef<HTMLDivElement>(null);
	const boardContainerRef = useRef<HTMLDivElement>(null);
	const [lastSavedBoardSize, setLastSavedBoardSize] = useLocalStorage<Partial<SizeAndPosition>>(
		LOCAL_STORAGE_BOARD_SIZE,
		{}
	);
	const [currentBoardSize, setCurrentBoardSize] = useState(lastSavedBoardSize);
	const lastSavedBoardSizeRef = useRef(lastSavedBoardSize);

	useEffect(() => {
		setCurrentBoardSize(lastSavedBoardSize);
		lastSavedBoardSizeRef.current = lastSavedBoardSize;
	}, [lastSavedBoardSize]);

	const isDefaultSizeAndPos = useMemo(() => size(currentBoardSize) === 0, [currentBoardSize]);

	const resetSizeAndPosition = useCallback(() => {
		setLastSavedBoardSize({});
	}, [setLastSavedBoardSize]);

	useEffect(() => {
		// reset position when the board is closed
		if (isEmpty(boards)) {
			setLastSavedBoardSize((prevState) => ({
				...prevState,
				left: undefined,
				top: undefined
			}));
		}
	}, [boards, setLastSavedBoardSize]);

	useEffect(() => {
		if (boardRef.current) {
			const boardElement = boardRef.current;
			setElementSizeAndPosition(boardElement, 'width', currentBoardSize.width);
			setElementSizeAndPosition(boardElement, 'height', currentBoardSize.height);
			setElementSizeAndPosition(boardElement, 'top', currentBoardSize.top);
			setElementSizeAndPosition(boardElement, 'left', currentBoardSize.left);
		}
	}, [currentBoardSize]);

	const updateBoardPosition = useMemo(
		() =>
			debounce(
				() => {
					if (boardContainerRef.current) {
						const boardContainer = boardContainerRef.current;
						const newSizeAndPosition: Partial<SizeAndPosition> = {};
						const topLimit = boardContainer.clientHeight - BOARD_MIN_VISIBILITY.top;
						if (lastSavedBoardSizeRef.current.top !== undefined) {
							if (lastSavedBoardSizeRef.current.top > topLimit) {
								newSizeAndPosition.top = topLimit > 0 ? topLimit : 0;
							} else {
								newSizeAndPosition.top = lastSavedBoardSizeRef.current.top;
							}
						}
						const leftLimit = boardContainer.clientWidth - 30;
						if (lastSavedBoardSizeRef.current.left !== undefined) {
							if (lastSavedBoardSizeRef.current.left > leftLimit) {
								newSizeAndPosition.left = leftLimit > 0 ? leftLimit : 0;
							} else {
								newSizeAndPosition.left = lastSavedBoardSizeRef.current.left;
							}
						}
						if (size(newSizeAndPosition) > 0) {
							setCurrentBoardSize({ ...lastSavedBoardSizeRef.current, ...newSizeAndPosition });
						}
					}
				},
				0,
				{ leading: false, trailing: true }
			),
		[]
	);

	useEffect(() => {
		updateBoardPosition();
		window.addEventListener('resize', updateBoardPosition);
		return (): void => {
			window.removeEventListener('resize', updateBoardPosition);
		};
	}, [updateBoardPosition]);

	return (
		(!isEmpty(boards) && current && (
			<BoardContainerComp expanded={expanded} minimized={minimized} ref={boardContainerRef}>
				<Board
					data-testid="NewItemContainer"
					background={'gray6'}
					crossAlignment="unset"
					expanded={expanded}
					ref={boardRef}
					width={currentBoardSize.width}
					height={currentBoardSize.height}
					maxWidth={(isDefaultSizeAndPos && '100%') || undefined}
					maxHeight={(isDefaultSizeAndPos && '100%') || undefined}
				>
					<ResizableContainer
						crossAlignment={'unset'}
						elementToResize={boardRef}
						localStorageKey={LOCAL_STORAGE_BOARD_SIZE}
						disabled={expanded}
					>
						<BoardHeader background="gray5">
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
								<Container gap={'0.25rem'} orientation={'horizontal'} width={'fit'} height={'fit'}>
									<Tooltip label={t('board.show_tabs', 'Show other tabs')} placement="top">
										<Dropdown items={boardDropdownItems}>
											<IconButton icon={'ChevronDown'} onClick={noop} />
										</Dropdown>
									</Tooltip>
									<Tooltip
										label={
											isDefaultSizeAndPos
												? t('board.reset_size.disabled', 'Board still at the default position')
												: t('board.reset_size.enabled', 'Return to default position and size')
										}
										placement="top"
									>
										<IconButton
											icon={'DiagonalArrowLeftDown'}
											onClick={resetSizeAndPosition}
											disabled={isDefaultSizeAndPos}
										/>
									</Tooltip>
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
								</Container>
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
		)) ||
		null
	);
};
