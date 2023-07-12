/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactElement, useCallback, useMemo, useState } from 'react';

import {
	Button,
	Container,
	Divider,
	Input,
	Padding,
	Row,
	Text
} from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';

import { IdentityProps } from '../../../../types';
import { EMAIL_VALIDATION_REGEX, SHELL_APP_ID } from '../../../constants';
import { getXmlSoapFetch } from '../../../network/fetch';

interface PasswordRecoverySettingsProps {
	t: TFunction;
	items: IdentityProps;
	createSnackbar: (arg: {
		key: string;
		replace: boolean;
		type: string;
		label: string;
		autoHideTimeout: number;
		hideButton: boolean;
	}) => void;
}
const PasswordRecoverySettings = ({
	t,
	items,
	createSnackbar
}: PasswordRecoverySettingsProps): ReactElement => {
	const title = t('label.passwords_recovery_settings', 'Password Recovery Account Settings');

	const recoveryEmail = useMemo(
		() => items.recoveryAccount || t('label.no_results', 'No results found'),
		[t, items.recoveryAccount]
	);
	const [emailValue, setEmailValue] = useState('');
	const [isValidEmail, setIsValidEmail] = useState(false);
	const inputLabel = useMemo(
		() => (emailValue ? '' : t('label.add_new_email', 'Add new e-mail address')),
		[emailValue, t]
	);

	const onChange = useCallback(
		(value: string): void => {
			setEmailValue(value);
			setIsValidEmail(EMAIL_VALIDATION_REGEX.test(value));
		},
		[setEmailValue, setIsValidEmail]
	);

	const onSubmit = useCallback(() => {
		getXmlSoapFetch(SHELL_APP_ID)(
			'SetRecoveryAccount',
			`<SetRecoveryAccountRequest xmlns="urn:zimbraMail" op="sendCode" recoveryAccount="${emailValue}"/>`
		).catch(() => {
			createSnackbar({
				key: `new`,
				replace: true,
				type: 'error',
				label: t('snackbar.error', 'Something went wrong, please try again'),
				autoHideTimeout: 3000,
				hideButton: true
			});
		});
	}, [createSnackbar, emailValue, t]);

	return (
		<>
			<Container
				minWidth="calc(min(100%, 32rem))"
				width="fill"
				padding={{ all: 'large' }}
				height="fit"
				background="gray6"
				mainAlignment="flex-start"
			>
				<Padding horizontal="medium" width="100%">
					<Text weight="bold">{title} </Text>
				</Padding>
			</Container>
			<Row
				width="fill"
				padding={{ horizontal: 'large', bottom: 'large' }}
				height="fit"
				background="gray6"
				mainAlignment="flex-start"
			>
				<Row width="fill" padding={{ bottom: 'medium' }}>
					<Text color="secondary">{recoveryEmail}</Text>
				</Row>
				<Divider />
			</Row>
			<Row
				width="fill"
				padding={{ horizontal: 'large', bottom: 'large' }}
				height="fit"
				background="gray6"
				mainAlignment="flex-start"
			>
				<Row takeAvailableSpace padding={{ right: 'small' }}>
					<Input
						label={inputLabel}
						value={emailValue}
						onChange={(ev): void => onChange(ev.target.value)}
						hasError={emailValue !== '' && !isValidEmail}
					/>
				</Row>
				<Row width="fit">
					<Button
						label={t('label.add_recovery_email', 'Add recovery e-mail')}
						color="primary"
						type="outlined"
						disabled={!isValidEmail}
						onClick={onSubmit}
					/>
				</Row>
			</Row>

			<Padding bottom="large" />
		</>
	);
};

export default PasswordRecoverySettings;
