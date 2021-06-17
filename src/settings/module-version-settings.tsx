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

import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormSubSection, Container, Text, Badge, Divider, Tooltip } from '@zextras/zapp-ui';
import { map } from 'lodash';
import { useAppList } from '../app-store/hooks';

const ModuleVersionSettings: FC = () => {
	const apps = useAppList();
	const [t] = useTranslation();

	const copyToClipboard: any = (e: any) => {
		e.preventDefault();
		navigator.clipboard.writeText(e.target.innerText);
	};

	return (
		<>
			<FormSubSection
				label={t('module.app.version', 'Application versions')}
				minWidth="calc(min(100%, 512px))"
				width="50%"
			>
				{map(apps, (app: any) => (
					<Container key={app.core.package} padding={{ horizontal: 'large', vertical: 'small' }}>
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
							<Text color="secondary">{app.core.description}</Text>
							{/* TODO: with giuliano: remove the hardcoded colors and convert to a sc */}
							<Badge value="Active" style={{ backgroundColor: '#8bc34a', color: 'white' }}></Badge>
						</Container>
						<Divider color="gray2" />
					</Container>
				))}
			</FormSubSection>
		</>
	);
};

export default ModuleVersionSettings;
