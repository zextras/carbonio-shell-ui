/* eslint-disable @typescript-eslint/ban-ts-comment */
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

import React, { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
	FormSubSection,
	Container,
	Text,
	Badge,
	Divider,
	Tooltip,
	ThemeContext
} from '@zextras/zapp-ui';
import { map } from 'lodash';
import { useAppList } from '../store/app/hooks';

import { SEARCH_APP_ID, SETTINGS_APP_ID } from '../constants/index';

const ModuleVersionSettings: FC = () => {
	const apps = useAppList();
	const [t] = useTranslation();
	const theme = useContext(ThemeContext);

	const copyToClipboard: any = (e: any) => {
		e.preventDefault();
		navigator.clipboard.writeText(e.target.innerText);
	};

	const filteredList = useMemo(
		() =>
			apps.filter((app) => app.core.name !== SEARCH_APP_ID && app.core.name !== SETTINGS_APP_ID),
		[apps]
	);
	return (
		<>
			<FormSubSection
				label={t('module.app.version', 'Application versions')}
				minWidth="calc(min(100%, 512px))"
				width="50%"
			>
				{map(filteredList, (app: any) => (
					<Container key={app.core.name} padding={{ horizontal: 'large', vertical: 'small' }}>
						<Container orientation="horizontal" mainAlignment="space-between">
							<Text>{app.core.name}</Text>
							<Tooltip placement="top" label="Click to copy">
								<Text style={{ cursor: 'pointer' }} onClick={(e: any): any => copyToClipboard(e)}>
									Version: {app.core.version}
								</Text>
							</Tooltip>
						</Container>
						<Container
							orientation="horizontal"
							mainAlignment="space-between"
							padding={{ top: 'extrasmall', bottom: 'medium' }}
						>
							<Text color="secondary">{app.core.display}</Text>
							<Badge
								value="Active"
								style={{
									// @ts-ignore
									backgroundColor: theme.palette.success.regular,
									// @ts-ignore
									color: theme.palette.gray6.regular
								}}
							></Badge>
						</Container>
						<Divider color="gray2" />
					</Container>
				))}
			</FormSubSection>
		</>
	);
};

export default ModuleVersionSettings;
