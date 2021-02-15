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

import { Container, IconButton, Row } from '@zextras/zapp-ui';
import { map, isEmpty } from 'lodash';
import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { BoardValueContext, BoardSetterContext } from './boards/board-context';

const AppIcon = styled(IconButton)`
	${(props) => props.active && css`
		background-color: ${props.theme.palette.gray5.regular}
	`}
`;

function ToggleBoardIcon() {
	const { boards, minimized } = useContext(BoardValueContext);
	const { toggleMinimized } = useContext(BoardSetterContext);

	if (isEmpty(boards)) return null;
	return (
		<IconButton
			iconColor="primary"
			icon={minimized ? 'BoardOpen' : 'BoardCollapse'}
			onClick={toggleMinimized}
			size="large"
		/>
	);
}

export default function ShellPrimaryBar({ mainMenuItems, activeApp }) {
	return (
		<Container
			width={48}
			height="fill"
			background="gray6"
			orientation="vertical"
			mainAlignment="flex-start"
		>
			<Row
				mainAlignment="flex-start"
				orientation="vertical"
				takeAvailableSpace
				wrap="nowrap"
				style={{ minHeight: '1px', overflowY: 'overlay' }}
			>
				{map(mainMenuItems, (app, key) => (
					<AppIcon
						key={key}
						icon={app.icon}
						active={activeApp === app.id}
						iconColor={activeApp === app.id ? 'primary' : 'text'}
						onClick={app.click}
						size="large"
					/>
				))}
			</Row>
			<Row>
				<ToggleBoardIcon />
			</Row>
		</Container>
	);
}
