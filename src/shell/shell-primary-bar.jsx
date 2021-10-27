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
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BoardValueContext, BoardSetterContext } from './boards/board-context';
import { useAppList } from '../store/app/hooks';
import { SEARCH_APP_ID, SETTINGS_APP_ID } from '../constants';

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
	const [t] = useTranslation();
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
							<Tooltip label={app.core.display} placement="right" key={app.core.name}>
								<IconButton
									icon={app.icon}
									backgroundColor={activeApp === app.core.route ? 'gray4' : 'gray6'}
									iconColor={activeApp === app.core.route ? 'primary' : 'text'}
									onClick={() => history.push(`/${app.core.route}/`)}
									size="large"
								/>
							</Tooltip>
						);
					}
					return <app.icon active={app.core.route === activeApp} />;
				})}
				<Tooltip label={t('search.app', 'Search')} placement="right" key={SEARCH_APP_ID}>
					<IconButton
						icon="SearchModOutline"
						backgroundColor={activeApp === SEARCH_APP_ID ? 'gray4' : 'gray6'}
						iconColor={activeApp === SEARCH_APP_ID ? 'primary' : 'text'}
						onClick={() => history.push(`/${SEARCH_APP_ID}/`)}
						size="large"
					/>
				</Tooltip>
				<Tooltip label={t('settings.app', 'Settings')} placement="right" key={SETTINGS_APP_ID}>
					<IconButton
						icon="SettingsModOutline"
						backgroundColor={activeApp === SETTINGS_APP_ID ? 'gray4' : 'gray6'}
						iconColor={activeApp === SETTINGS_APP_ID ? 'primary' : 'text'}
						onClick={() => history.push(`/${SETTINGS_APP_ID}/`)}
						size="large"
					/>
				</Tooltip>
			</Row>
			<Row>
				<ToggleBoardIcon />
			</Row>
		</ContainerWithDivider>
	);
}
