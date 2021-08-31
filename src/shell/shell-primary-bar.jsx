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

import { Container, IconButton, Row, Tooltip } from '@zextras/zapp-ui';
import { map, isEmpty } from 'lodash';
import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { useHistory } from 'react-router-dom';
import { BoardValueContext, BoardSetterContext } from './boards/board-context';
import { useAppList } from '../store/app/hooks';

const AppIcon = styled(IconButton)`
	${(props) =>
		props.active &&
		css`
			background-color: ${props.theme.palette.gray5.regular};
		`}
`;

const ContainerWithDivider = styled(Container)`
	border-right: 1px solid ${({ theme }) => theme.palette.gray3.regular};
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

export default function ShellPrimaryBar({ activeApp }) {
	const apps = useAppList();
	const history = useHistory();
	return (
		<ContainerWithDivider
			width={49}
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
				{map(apps, (app) => {
					if (!app.icon) {
						return null;
					}
					if (typeof app.icon === 'string') {
						return (
							<Tooltip label={app.core.name} placement="right">
								<AppIcon
									key={app.core.package}
									icon={app.icon}
									active={activeApp === app.core.package}
									iconColor={activeApp === app.core.package ? 'primary' : 'text'}
									onClick={() => history.push(`/${app.core.package}/`)}
									size="large"
								/>
							</Tooltip>
						);
					}
					return <app.icon active={app.core.package === activeApp} />;
				})}
			</Row>
			<Row>
				<ToggleBoardIcon />
			</Row>
		</ContainerWithDivider>
	);
}
