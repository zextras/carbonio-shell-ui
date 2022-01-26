/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo, useCallback, ReactElement, useState } from 'react';
import {
	Container,
	Text,
	Padding,
	Input,
	Row,
	Button,
	Divider
} from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';
import { map } from 'lodash';
import { SHELL_APP_ID, REGEX_VALIDATION } from '../../../constants';
import { IdentityProps, Mods } from '../../../../types';
import { useAccountStore } from '../../../store/account/store';

interface PasswordRecoverySettingsProps {
	t: TFunction;
	items: IdentityProps;
	identities: IdentityProps[];
	setIdentities: (value: IdentityProps[]) => void;
}
const PasswordRecoverySettings = ({
	t,
	items,
	identities,
	setIdentities
}: PasswordRecoverySettingsProps): ReactElement => {
	const [mods, setMods] = useState<Mods>({});
	const title = useMemo(
		() => t('label.passwords_recovery_settings', 'Password Recovery Account Settings'),
		[t]
	);

	const recoveryEmail = useMemo(
		() => items.recoveryAccount || t('label.no_results', 'No results found'),
		[t, items.recoveryAccount]
	);
	const [emailValue, setEmailValue] = useState('');
	const [isValidEmail, setIsValidEmail] = useState(false);
	const inputLabel = useMemo(() => t('label.add_new_email', 'Add new e-mail address'), [t]);

	const onChange = useCallback(
		(
			ev: MouseEvent & {
				target: HTMLButtonElement;
			}
		): void => {
			setEmailValue(ev.target.value);
			setIsValidEmail(REGEX_VALIDATION.test(ev.target.value));
		},
		[setEmailValue, setIsValidEmail]
	);

	const onSubmit = useCallback(() => {
		useAccountStore.getState().xmlSoapFetch(SHELL_APP_ID)(
			'SetRecoveryAccount',
			`<SetRecoveryAccountRequest xmlns="urn:zimbraMail" op="sendCode" recoveryAccount="${emailValue}"/>`
		);
		if (Object.keys(mods).length > 0 && mods.prefs?.zimbraPrefIdentityName !== undefined) {
			const newValue = mods.prefs?.zimbraPrefIdentityName as string;
			const result = map(identities, (item, index) =>
				index === 0 ? { ...item, identityName: newValue } : item
			);
			setIdentities(result);
		}
		setMods({});
	}, [mods, identities, setIdentities, emailValue]);

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
					<Text background="gray6" color="secondary">
						{recoveryEmail}
					</Text>
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
						background="gray5"
						onChange={(
							ev: MouseEvent & {
								target: HTMLButtonElement;
							}
						): void => onChange(ev)}
					/>
				</Row>
				<Row width="fit">
					<Button
						label={t('label.add_recovery_email', 'Add recovery e-mail')}
						color="primary"
						type="outlined"
						disabled={!isValidEmail}
						onClick={(): void => onSubmit()}
					/>
				</Row>
			</Row>

			<Padding bottom="large" />
		</>
	);
};

export default PasswordRecoverySettings;
