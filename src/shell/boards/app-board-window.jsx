/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import React, { useContext, useRef, useMemo, useLayoutEffect } from 'react';
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
	useHiddenCount,
	Tooltip
} from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import AppBoardTab from './app-board-tab';
import AppBoard from './app-board';
import { BoardSetterContext, BoardValueContext } from './board-context';
import { useApps } from '../../app-store/hooks';

function TabsList({ tabs, currentBoard, setCurrentBoard, largeView, t }) {
	const apps = useApps();
	const tabContainerRef = useRef();
	const [hiddenTabsCount, recalculateHiddenTabs] = useHiddenCount(tabContainerRef, largeView);

	useLayoutEffect(() => {
		recalculateHiddenTabs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tabs, largeView, tabContainerRef.current]);

	return (
		<Row wrap="nowrap" height="100%" mainAlignment="flex-start" takeAvailableSpace>
			<Row
				ref={tabContainerRef}
				height="48px"
				mainAlignment="flex-start"
				style={{ overflow: 'hidden' }}
				width="calc(100% - 8px)"
			>
				{tabs &&
					map(tabs, (tab) => (
						<AppBoardTab
							key={tab.key}
							idx={tab.key}
							icon={apps?.[tab.app]?.icon ?? 'Edit2Outline'}
							iconSize="large"
						/>
					))}
			</Row>
			{hiddenTabsCount > 0 && (
				<>
					<Container width="fit" padding={{ horizontal: 'extrasmall', vertical: 'extrasmall' }}>
						<Container width="1px" heigth="fill" background="gray3" />
					</Container>
					<Dropdown
						width="fit"
						style={{ flexGrow: '1' }}
						items={map(slice(tabs, -hiddenTabsCount), (tab) => ({
							id: tab.key,
							label: tab.title,
							icon: tab.icon,
							click: () => setCurrentBoard(tab.key),
							selected: tab.key === currentBoard
						}))}
					>
						<Tooltip label={t('board.show_tabs', 'Show other tabs')} placement="top">
							<Button
								type="ghost"
								color="secondary"
								label={`+${hiddenTabsCount}`}
								padding={{ all: 'extrasmall' }}
							/>
						</Tooltip>
					</Dropdown>
				</>
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
	background-color: rgba(0, 0, 0, 0);
	pointer-events: none;
	z-index: 10;
	${({ largeView }) =>
		largeView &&
		css`
			background-color: rgba(0, 0, 0, 0.5);
			pointer-events: auto;
		`}
	${({ minimized }) =>
		minimized &&
		css`
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
	box-shadow: 0 2px 5px 0 rgba(125, 125, 125, 0.5);
	pointer-events: auto;
	${({ largeView }) =>
		largeView &&
		css`
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
	const [t] = useTranslation();
	const { boards: shellBoards, currentBoard, largeView, minimized } = useContext(BoardValueContext);
	const { toggleLargeView, toggleMinimized, removeAllBoards, setCurrentBoard } = useContext(
		BoardSetterContext
	);

	const [tabs, boards] = useMemo(
		() =>
			reduce(
				shellBoards,
				(r, v, k) => {
					const [_t, p] = r;
					_t.push({ key: k, ...v });
					p.push(<AppBoard key={k} idx={k} />);
					return r;
				},
				[[], []]
			),
		[shellBoards]
	);

	if (!tabs.length) return null;
	return (
		<BoardContainer largeView={largeView} minimized={minimized}>
			<Board background="gray6" crossAlignment="unset" largeView={largeView}>
				<BoardHeader background="gray5">
					<Padding all="extrasmall">
						<Tooltip label={t('board.hide', 'Hide board')} placement="top">
							<BackButton icon="BoardCollapseOutline" onClick={toggleMinimized} />
						</Tooltip>
					</Padding>
					<TabsList
						tabs={tabs}
						largeView={largeView}
						currentBoard={currentBoard}
						setCurrentBoard={setCurrentBoard}
						t={t}
					/>
					<Actions padding={{ all: 'extrasmall' }}>
						{boards[currentBoard]?.context?.onReturnToApp && (
							<Padding right="extrasmall">
								<IconButton
									icon={'DiagonalArrowRightUp'}
									onClick={boards[currentBoard]?.context?.onReturnToApp}
								/>
							</Padding>
						)}
						<Padding right="extrasmall">
							<Tooltip label={t('board.open_app', 'Open in app')} placement="top">
								<IconButton icon="DiagonalArrowRightUpOutline" onClick={toggleLargeView} />
							</Tooltip>
						</Padding>
						<Padding right="extrasmall">
							<Tooltip label={t('board.enlarge', 'Enlarge board')} placement="top">
								<IconButton
									icon={largeView ? 'CollapseOutline' : 'ExpandOutline'}
									onClick={toggleLargeView}
								/>
							</Tooltip>
						</Padding>
						<Tooltip label={t('board.close_tabs', 'Close all your tabs')} placement="top">
							<IconButton icon="CloseOutline" onClick={removeAllBoards} />
						</Tooltip>
					</Actions>
				</BoardHeader>
				<Divider style={{ height: '2px' }} />
				<BoardDeatilContainer takeAvailableSpace>{boards}</BoardDeatilContainer>
			</Board>
		</BoardContainer>
	);
}
