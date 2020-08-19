/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { reduce } from 'lodash';// eslint-disable-next-line
import { Container, Divider, IconButton, Row, Padding } from '@zextras/zapp-ui';
import ShellContext from '../shell-context';
import AppBoardTab from './app-board-tab';
import AppBoard from './app-board';

const BoardContainer = styled.div`
	position: fixed;
	top: 48px;
	bottom: 0;
	left: 48px;
	right: 0;
	background-color: rgba(0,0,0,0);
	pointer-events: none;
	${({ largeView }) => largeView && css`
		background-color: rgba(0,0,0,0.5);
		pointer-events: auto;
	`}
	${({ minimized }) => minimized && css`
		display: none;
	`}
`;
const Board = styled(Container)`
	position: absolute;
	left: 24px;
	bottom: 0;
	width: 700px;
	height: 60vh;
	min-height: 400px;
	box-shadow: 0 2px 5px 0 rgba(125,125,125,0.5);
	pointer-events: auto;
	${({ largeView }) => largeView && css`
		height: calc(100% - 24px);
		width: calc(100% - 24px * 2);
		min-height: auto;
	`}
`;
const BoardHeader = styled(Row)``;
const BoardDeatilContainer = styled(Row)`
	min-height: 0;
`;
const BackButton = styled(IconButton)``;
const TabsContainer = styled(Row)``;
const Actions = styled(Row)``;

export default function AppBoardWindow() {
	const {
		boards: shellBoards,
		largeView,
		toggleLargeView,
		minimized,
		toggleMinimized,
		removeAllBoards
	} = useContext(ShellContext);

	const [tabs, boards] = reduce(
		shellBoards,
		(r, v, k) => {
			const [t, p] = r;
			t.push((
				<AppBoardTab key={k} idx={k} />
			));
			p.push((
				<AppBoard key={k} idx={k} />
			));
			return r;
		},
		[[], []]
	);

	if (!tabs.length) return null;
	return (
		<BoardContainer
			largeView={largeView}
			minimized={minimized}
		>
			<Board
				background="gray6"
				crossAlignment="unset"
				largeView={largeView}
			>
				<BoardHeader background="gray5">
					<Padding all="extrasmall"><BackButton icon="ChevronLeftOutline" onClick={toggleMinimized} /></Padding>
					<TabsContainer height="100%" mainAlignment="flex-start" takeAvailableSpace={true}>
						{ tabs }
					</TabsContainer>
					<Actions padding={{ all: 'extrasmall' }}>
						<Padding right="extrasmall"><IconButton icon={largeView ? 'CollapseOutline' : 'ExpandOutline'} onClick={toggleLargeView} /></Padding>
						<IconButton icon="CloseOutline" onClick={removeAllBoards} />
					</Actions>
				</BoardHeader>
				<Divider style={{ height: '2px' }} />
				<BoardDeatilContainer takeAvailableSpace={true}>
					{ boards }
				</BoardDeatilContainer>
			</Board>
		</BoardContainer>
	);
}
