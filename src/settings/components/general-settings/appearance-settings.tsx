/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';

import { Container, Text } from '@zextras/carbonio-design-system';

import { getT } from '../../../store/i18n';
import { appearanceSubSection } from '../../general-settings-sub-sections';

interface AppearanceSettingsProps {
	children: React.ReactElement | React.ReactElement[];
}

const AppearanceSettings = ({ children }: AppearanceSettingsProps): JSX.Element => {
	const t = getT();
	const subSection = useMemo(() => appearanceSubSection(t), [t]);
	return (
		<Container
			mainAlignment="flex-start"
			crossAlignment="flex-start"
			gap="1rem"
			padding={'large'}
			minWidth="calc(min(100%, 32rem))"
			width="50%"
			height={'fit'}
			id={subSection.id}
			background={'gray6'}
		>
			<Text weight={'bold'} size={'medium'}>
				{subSection.label}
			</Text>
			{children}
		</Container>
	);
};

export default AppearanceSettings;
