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
import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { IconButton, Text, Row, Padding } from '@zextras/zapp-ui';
import ShellContext from '../shell-context';

const TabContainer = styled(Row)`
	cursor: pointer;
	height: 100%;
	width: 160px;
	user-select: none;
`;

export default function AppBoardTab({ idx }) {
	const {
		boards,
		removeBoard,
		currentBoard,
		setCurrentBoard
	} = useContext(ShellContext);

	const onClick = useCallback(() => setCurrentBoard(idx), [idx]);

	const onRemove = useCallback((ev) => {
		ev.stopPropagation();
		removeBoard(idx);
	}, [removeBoard, idx]);

	return (
		<TabContainer active={currentBoard === idx}>
			<Row height="100%" onClick={onClick} takeAvailableSpace={true}>
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
