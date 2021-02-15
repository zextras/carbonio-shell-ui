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
import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';
import {
	IconButton, Text, Row, Padding
} from '@zextras/zapp-ui';
import { BoardValueContext, BoardSetterContext } from './board-context';

const TabContainer = styled(Row)`
	cursor: pointer;
	height: 100%;
	width: 160px;
	user-select: none;
`;

export default function AppBoardTab({ idx }) {
	const {
		boards,
		currentBoard
	} = useContext(BoardValueContext);
	const {
		removeBoard,
		setCurrentBoard
	} = useContext(BoardSetterContext);

	const onClick = useCallback(() => setCurrentBoard(idx), [idx]);

	const onRemove = useCallback((ev) => {
		ev.stopPropagation();
		removeBoard(idx);
	}, [idx]);

	return (
		<TabContainer active={currentBoard === idx}>
			<Row height="100%" onClick={onClick} takeAvailableSpace>
				<Text
					size="large"
					weight={currentBoard === idx ? 'bold' : 'regular'}
					color={currentBoard === idx ? 'text' : 'secondary'}
				>
					{boards[idx].title}
				</Text>
			</Row>
			<Padding right="small">
				<IconButton iconColor="secondary" icon="Close" onClick={onRemove} size="small" />
			</Padding>
		</TabContainer>
	);
}
