/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import React, {	useContext, useEffect, useRef, useMemo} from 'react';
import styled, { css } from 'styled-components';
import { reduce, map, slice } from 'lodash';
import {
	Container,
	Divider,
	IconButton,
	Row,
	Padding,
	Dropdown,
	Button,
	useHiddenCount
} from '@zextras/zapp-ui';
import AppBoardTab from './app-board-tab';
import AppBoard from './app-board';
import { BoardSetterContext, BoardValueContext } from './board-context';

function TabsList({
	tabs, currentBoard, setCurrentBoard, largeView
}) {
	const tabContainerRef = useRef();
	const [hiddenTabsCount, recalculateHiddenTabs] = useHiddenCount(tabContainerRef, largeView);

	useEffect(() => {
		recalculateHiddenTabs();
	}, [tabs, largeView, tabContainerRef.current]);

	return (
		<Row
			wrap="nowrap"
			height="100%"
			mainAlignment="flex-start"
			takeAvailableSpace
		>
			<Row
				ref={tabContainerRef}
				height="48px"
				mainAlignment="flex-start"
				style={{ overflow: 'hidden' }}
			>
				{tabs && map(tabs, (tab) => <AppBoardTab key={tab.key} idx={tab.key} />)}
			</Row>
			{hiddenTabsCount > 0 && (
				<Dropdown
					style={{ flexGrow: '1' }}
					items={map(slice(tabs, -hiddenTabsCount), (tab) => ({
						id: tab.key,
						label: tab.title,
						icon: tab.icon,
						click: () => setCurrentBoard(tab.key),
						selected: tab.key === currentBoard
					}))}
				>
					<Button type="ghost" color="secondary" label={`+${hiddenTabsCount}`} />
				</Dropdown>
			)}
		</Row>
	);
}

const BoardContainer = styled.div`
	position: fixed;
	top: 48px;
	bottom: 0;
	left: 48px;
	right: 0;
	background-color: rgba(0,0,0,0);
	pointer-events: none;
	z-index: 10;
	${({ largeView }) => largeView && css`
		background-color: rgba(0,0,0,0.5);
		pointer-events: auto;
	`}
	${({ minimized }) => minimized && css`
		display: none;
	`}
`;
const Board = styled(Container)`
	z-index: 5;
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
const Actions = styled(Row)``;

export default function AppBoardWindow() {
	const {
		boards: shellBoards,
		currentBoard,
		largeView,
		minimized
	} = useContext(BoardValueContext);
	const {
		toggleLargeView,
		toggleMinimized,
		removeAllBoards,
		setCurrentBoard
	} = useContext(BoardSetterContext);

	const [tabs, boards] = useMemo(() => reduce(
		shellBoards,
		(r, v, k) => {
			const [t, p] = r;
			t.push({ key: k, ...v });
			p.push(<AppBoard key={k} idx={k} />);
			return r;
		},
		[[], []]
	), [shellBoards]);

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
					<TabsList
						tabs={tabs}
						largeView={largeView}
						currentBoard={currentBoard}
						setCurrentBoard={setCurrentBoard}
					/>
					<Actions padding={{ all: 'extrasmall' }}>
						<Padding right="extrasmall"><IconButton icon={largeView ? 'CollapseOutline' : 'ExpandOutline'} onClick={toggleLargeView} /></Padding>
						<IconButton icon="CloseOutline" onClick={removeAllBoards} />
					</Actions>
				</BoardHeader>
				<Divider style={{ height: '2px' }} />
				<BoardDeatilContainer takeAvailableSpace>
					{ boards }
				</BoardDeatilContainer>
			</Board>
		</BoardContainer>
	);
}
