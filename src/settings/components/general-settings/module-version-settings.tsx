/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
	Badge,
	Container,
	Divider,
	FormSubSection,
	Text,
	ThemeContext,
	Tooltip
} from '@zextras/carbonio-design-system';
import { map } from 'lodash';
import React, { FC, useContext, useMemo } from 'react';
import { useAppList } from '../../../store/app/hooks';

import { CarbonioModule } from '../../../../types';
import { SEARCH_APP_ID, SETTINGS_APP_ID } from '../../../constants/index';
import { getT } from '../../../store/i18n';
import { versionsSubSection } from '../../general-settings-sub-sections';

const ModuleVersionSettings: FC = () => {
	const apps = useAppList();
	const t = getT();
	const theme = useContext(ThemeContext);

	const copyToClipboard: any = (e: any) => {
		e.preventDefault();
		navigator.clipboard.writeText(e.target.innerText);
	};

	const filteredList = useMemo(
		() => apps.filter((app) => app.name !== SEARCH_APP_ID && app.name !== SETTINGS_APP_ID),
		[apps]
	);
	const sectionTitle = useMemo(() => versionsSubSection(t), [t]);
	return (
		<>
			<FormSubSection
				label={sectionTitle.label}
				minWidth="calc(min(100%, 32rem))"
				width="50%"
				id={sectionTitle.id}
			>
				{map(filteredList, (app: CarbonioModule) => (
					<Container key={app.name} padding={{ horizontal: 'large', vertical: 'small' }}>
						<Container orientation="horizontal" mainAlignment="space-between">
							<Text>
								{app.display} ({app.name})
							</Text>
							<Tooltip placement="top" label={t('label.click_to_copy', 'Click to copy')}>
								<Text style={{ cursor: 'pointer' }} onClick={(e: any): any => copyToClipboard(e)}>
									Version: {app.version}
								</Text>
							</Tooltip>
						</Container>
						<Container
							orientation="horizontal"
							mainAlignment="space-between"
							padding={{ top: 'extrasmall', bottom: 'medium' }}
						>
							<Text color="secondary">{app.description}</Text>
							<Badge
								value="Active"
								style={{
									backgroundColor: theme.palette.success.regular,
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
