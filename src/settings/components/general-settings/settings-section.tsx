/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { Container, Text } from '@zextras/carbonio-design-system';

import type { SettingsSubSection } from '../../../types/apps';

type SettingsSectionProps = React.PropsWithChildren<SettingsSubSection>;

export const SettingsSection = ({
	children,
	label,
	id
}: SettingsSectionProps): React.JSX.Element => (
	<Container
		mainAlignment="flex-start"
		crossAlignment="flex-start"
		gap="1rem"
		padding={'large'}
		minWidth="calc(min(100%, 32rem))"
		width="50%"
		height={'fit'}
		id={id}
		data-testid={id}
		background={'gray6'}
	>
		<Text weight={'bold'} size={'large'} lineHeight={1.5}>
			{label}
		</Text>
		{children}
	</Container>
);
