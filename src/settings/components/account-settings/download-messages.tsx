/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { ReactElement, useState } from 'react';
import {
	Container,
	Text,
	Padding,
	RadioGroup,
	Radio,
	Row,
	Checkbox
} from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';

interface DownloadMessagesProps {
	t: TFunction;
}

const DownloadMessages = ({ t }: DownloadMessagesProps): ReactElement => {
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
					<Text weight="bold">{t('label.download_messages', 'Download messages to:')}</Text>
				</Padding>
			</Container>
			<Row
				width="fill"
				background="gray6"
				mainAlignment="flex-start"
				padding={{ horizontal: 'large', bottom: 'large' }}
			>
				<RadioGroup
					style={{ width: '100%', justifyContent: 'flex-start' }}
					value={activeValue}
					onChange={(newValue: string): void => setActiveValue(newValue)}
				>
					<Radio width="100%" label={t('label.inbox', 'Inbox')} value="1" />
					<Padding bottom="medium" />
					<Radio
						label={t('label.folder_external_account', 'Folder: New External Account')}
						value="2"
					/>
				</RadioGroup>
			</Row>
			<Row
				width="fill"
				background="gray6"
				mainAlignment="flex-start"
				padding={{ horizontal: 'large', bottom: 'large' }}
			>
				<Checkbox
					label={t(
						'label.delete_after_download',
						'Delete messages from the server after the download'
					)}
				/>
			</Row>
			<Padding bottom="large" />
		</>
	);
};

export default DownloadMessages;
