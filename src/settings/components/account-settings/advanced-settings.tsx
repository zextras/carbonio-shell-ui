/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// this component is work in progress for when the mails sync is implemented

import React, { ReactElement } from 'react';
import {
	Container,
	Text,
	Padding,
	Input,
	Row,
	Button,
	Checkbox
} from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';

interface AdvancedSettingsProps {
	t: TFunction;
}

const AdvancedSettings = ({ t }: AdvancedSettingsProps): ReactElement => (
	<>
		<Container
			minWidth="calc(min(100%, 512px))"
			width="fill"
			padding={{ all: 'large' }}
			height="fit"
			background="gray6"
			mainAlignment="flex-start"
		>
			<Padding horizontal="medium" width="100%">
				<Text weight="bold">{t('label.advanced_settings', 'Advanced Settings')}</Text>
			</Padding>
		</Container>
		<Row
			width="fill"
			background="gray6"
			mainAlignment="flex-start"
			padding={{ horizontal: 'large', bottom: 'large' }}
		>
			<Checkbox
				label={t('label.change_pop', 'Change POP port')}
				width="fit"
				onClick={(): void => {
					null;
				}}
			/>
			<Padding right="large" />
			<Input
				width="100px"
				label={t('label.pop_port', 'POP port')}
				value="110"
				onChange={(): void => {
					null;
				}}
				background="gray5"
			/>
		</Row>
		<Row
			width="fill"
			background="gray6"
			mainAlignment="flex-start"
			padding={{ horizontal: 'large', bottom: 'large' }}
		>
			<Checkbox
				label={t('label.use_ssl', 'Use an encrypter connection (SSL) when accessing this server')}
				onClick={(): void => {
					null;
				}}
			/>
		</Row>

		<Row
			padding={{ horizontal: 'large' }}
			width="fill"
			mainAlignment="flex-start"
			background="gray6"
		>
			<Padding bottom="large">
				<Button
					label={t('label.test_settings', 'Test Settings')}
					onClick={(): void => {
						null;
					}}
					color="primary"
					type="outlined"
				/>
			</Padding>
		</Row>
		<Padding bottom="large" />
	</>
);

export default AdvancedSettings;
