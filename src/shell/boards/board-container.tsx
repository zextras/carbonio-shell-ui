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
import React, { FC } from 'react';
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

export const BoardContainer: FC = () => {
	const t = getT();
	const { boards, minimized, expanded, current } = useBoardStore();
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
