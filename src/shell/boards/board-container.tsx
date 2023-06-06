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
import { isEmpty, map, noop } from 'lodash';
import React, { FC, useCallback, useMemo } from 'react';
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

const BoardContainerComp = styled.div<{ expanded: boolean; minimized: boolean }>`
	position: fixed;
	top: 3.75rem;
	bottom: 0;
	left: 3rem;
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

const OverflowContainer = styled(Container)`
	overflow: auto;
`;

const Board = styled(Container)<{ expanded: boolean }>`
	z-index: 5;
	position: absolute;
	left: 1.5rem;
	bottom: 0;
	width: 700px;
	height: 70vh;
	min-height: 400px;
	box-shadow: 0 0.125rem 0.3125rem 0 rgba(125, 125, 125, 0.5);
	pointer-events: auto;
	${({ expanded }): SimpleInterpolation =>
		expanded &&
		css`
			height: calc(100% - 1.5rem);
			width: calc(100% - 1.5rem * 2);
			min-height: auto;
		`}
`;
const BoardHeader = styled(Row)``;
const BoardDetailContainer = styled(Row)`
	min-height: 0;
`;
const BackButton = styled(IconButton)``;
const Actions = styled(Row)``;

interface ListItemContentProps {
	icon?: string;
	label: string;
	selected?: boolean;
	app?: string;
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
					{app &&
						t('board.from_app', 'From {{app}}', {
							app
						})}
				</Text>
			</OverflowContainer>
			<IconButton icon={'CloseOutline'} size={'large'} onClick={onClose} />
		</Container>
	);
}

export const BoardContainer: FC = () => {
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
							app={getApp(boards[boardId].app)()?.display}
							boardId={boardId}
						/>
					)
				})
			),
		[boards, current, orderedBoards]
	);

	if (isEmpty(boards) || !current) return null;
	return (
		<BoardContainerComp expanded={expanded} minimized={minimized}>
			<Board
				data-testid="NewItemContainer"
				background="gray6"
				crossAlignment="unset"
				expanded={expanded}
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
						<Padding right="extrasmall">
							<Tooltip label={t('board.show_tabs', 'Show other tabs')} placement="top">
								<Dropdown items={boardDropdownItems}>
									<IconButton icon={'ChevronDown'} onClick={noop} />
								</Dropdown>
							</Tooltip>
						</Padding>
						<Padding right="extrasmall">
							<Tooltip
								label={
									expanded ? t('board.reduce', 'Reduce board') : t('board.enlarge', 'Enlarge board')
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
			</Board>
		</BoardContainerComp>
	);
};
