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

import { Container, IconButton, Row } from '@zextras/zapp-ui';
import { map } from 'lodash';
import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import ShellContext from './shell-context';

const AppIcon = styled(IconButton)`
	${(props) => props.active && css`
		background-color: ${props.theme.palette.gray5.regular}
	`}	
`;

export default function ShellPrimaryBar({
	mainMenuItems,
	activeApp
}) {
	const {
		boards: shellBoards,
		minimized,
		toggleMinimized
	} = useContext(ShellContext);

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
				takeAvailableSpace={true}
				wrap="nowrap"
				style={{ minHeight: '1px', overflowY: 'overlay' }}
			>
				{ map(mainMenuItems, (app, key) =>
					<AppIcon
						key={key}
						iconColor={activeApp === app.id ? 'primary' : 'text'}
						active={activeApp === app.id}
						icon={app.icon}
						onClick={app.click}
						size="large"
					/>
				)}
			</Row>
			{
				shellBoards.length > 0 && (
					<Row>
						<IconButton
							iconColor="primary"
							icon={minimized ? 'BoardOpen' : 'BoardCollapse'}
							onClick={toggleMinimized}
							size="large"
						/>
					</Row>
				)
			}
		</Container>
	);
}