/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { isEmpty, map } from 'lodash';
import {
	Container,
	Divider,
	IconButton,
	Row,
	Padding,
	Tooltip
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import {
	closeAllBoards,
	expandBoards,
	minimizeBoards,
	onGoToPanel,
	reduceBoards,
	useBoardStore
} from '../../store/boards';
import { TabsList } from './board-tab-list';
import { AppBoard } from './board';

const BoardContainerComp = styled.div<{ expanded: boolean; minimized: boolean }>`
	position: fixed;
	top: 60px;
	bottom: 0;
	left: 48px;
	right: 0;
	background-color: rgba(0, 0, 0, 0);
	pointer-events: none;
	z-index: 10;
	${({ expanded }): any =>
		expanded &&
		css`
			background-color: rgba(0, 0, 0, 0.5);
			pointer-events: auto;
		`}
	${({ minimized }): any =>
		minimized &&
		css`
			display: none;
		`}
`;
const Board = styled(Container)<{ expanded: boolean }>`
	z-index: 5;
	position: absolute;
	left: 24px;
	bottom: 0;
	width: 700px;
	height: 70vh;
	min-height: 400px;
	box-shadow: 0 2px 5px 0 rgba(125, 125, 125, 0.5);
	pointer-events: auto;
	${({ expanded }): any =>
		expanded &&
		css`
			height: calc(100% - 24px);
			width: calc(100% - 24px * 2);
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
	const [t] = useTranslation();
	const { boards, minimized, expanded, current } = useBoardStore();
	if (isEmpty(boards) || !current) return null;
	return (
		<BoardContainerComp expanded={expanded} minimized={minimized}>
			<Board background="gray6" crossAlignment="unset" expanded={expanded}>
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
				<Divider style={{ height: '2px' }} />
				<BoardDetailContainer takeAvailableSpace>
					{map(boards, (b) => (
						<AppBoard key={b.id} board={b} />
					))}
				</BoardDetailContainer>
			</Board>
		</BoardContainerComp>
	);
};
