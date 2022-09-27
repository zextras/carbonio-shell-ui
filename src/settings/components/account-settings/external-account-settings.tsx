/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactElement, useState } from 'react';
import {
	Container,
	Text,
	Input,
	Row,
	Padding,
	Radio,
	RadioGroup,
	PasswordInput
} from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';

type ExternalAccountProps = {
	t: TFunction;
};

type ListItemProps = {
	active: boolean;
	item: { label: string; email: string; type: string };
	selected: boolean;
	setSelected: () => void;
	background: string;
	selectedBackground: string;
	activeBackground: string;
};

const ExternalAccount = ({ t }: ExternalAccountProps): ReactElement => {
	const [activeValue, setActiveValue] = useState('1');

	return (
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
					<Text weight="bold">
						{t('label.external_account_settings', 'External Account Settings')}
					</Text>
				</Padding>
			</Container>
			<Row
				width="fill"
				padding={{ horizontal: 'large', bottom: 'large' }}
				height="fit"
				background="gray6"
				mainAlignment="flex-start"
			>
				<Row width="50%" padding={{ right: 'small' }}>
					<Input
						label={t('label.email_address', 'E-mail address')}
						value="name.surname@company.com"
					/>
				</Row>
				<Row width="50%">
					<Input label={t('label.account_name', 'Account Name')} value="New External Account 1" />
				</Row>
			</Row>
			<Row
				padding={{ horizontal: 'large' }}
				width="fill"
				mainAlignment="flex-start"
				background="gray6"
			>
				<Padding left="small" width="100%">
					<Text weight="bold">{t('label.account_type', 'Account Type')}</Text>
				</Padding>
			</Row>
			<Container
				minWidth="calc(min(100%, 512px))"
				width="100%"
				padding={{ all: 'large' }}
				height="fit"
				background="gray6"
				mainAlignment="flex-start"
			>
				<RadioGroup style={{ width: '100%' }} value={activeValue}>
					<Radio width="100%" label={t('label.pop3', 'POP3')} value="1" />
					<Padding bottom="medium" />
					<Radio label={t('label.imap', 'IMAP')} value="2" />
				</RadioGroup>
			</Container>
			<Row
				width="fill"
				padding={{ horizontal: 'large', bottom: 'large' }}
				height="fit"
				background="gray6"
				mainAlignment="flex-start"
			>
				<Row width="70%" padding={{ bottom: 'small' }}>
					<Input label={t('label.account_username', 'Account Username')} value="" />
				</Row>
				<Row width="70%" padding={{ bottom: 'small' }}>
					<Input
						label={t('label.email_server', 'E-mail server (e.g. “mail.example.com”)')}
						value=""
					/>
				</Row>
				<Row width="70%">
					<PasswordInput label={t('label.password', 'Password')} value="" />
				</Row>
			</Row>
			<Padding bottom="large" />
		</>
	);
};

export default ExternalAccount;
