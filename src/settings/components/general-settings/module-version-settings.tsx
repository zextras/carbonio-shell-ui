/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo } from 'react';

import type { TextProps } from '@zextras/carbonio-design-system';
import {
	Badge,
	Container,
	Divider,
	FormSubSection,
	Text,
	Tooltip,
	useTheme
} from '@zextras/carbonio-design-system';
import { map } from 'lodash';

import { SEARCH_APP_ID, SETTINGS_APP_ID } from '../../../constants';
import { useAppList } from '../../../store/app';
import { getT } from '../../../store/i18n/hooks';
import type { CarbonioModule } from '../../../types/apps';
import { versionsSubSection } from '../../general-settings-sub-sections';

const ModuleVersionSettings = (): React.JSX.Element => {
	const apps = useAppList();
	const t = getT();
	const theme = useTheme();

	const copyToClipboard = useCallback<NonNullable<TextProps['onClick']>>((e) => {
		e.preventDefault();
		if (e.target instanceof HTMLElement) {
			navigator.clipboard.writeText(e.target.innerText);
		}
	}, []);

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
							<Text>{app.display}</Text>
							<Tooltip placement="top" label={t('label.click_to_copy', 'Click to copy')}>
								<Text style={{ cursor: 'pointer' }} onClick={copyToClipboard}>
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
							/>
						</Container>
						<Divider color="gray2" />
					</Container>
				))}
			</FormSubSection>
		</>
	);
};

export default ModuleVersionSettings;
