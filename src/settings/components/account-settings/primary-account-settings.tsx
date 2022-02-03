/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo, useCallback, ReactElement, useState, useEffect } from 'react';
import { Container, Text, Padding, Input, Row } from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';
import { IdentityProps } from '../../../../types';

interface PrimaryAccountSettingsProps {
	t: TFunction;
	items: IdentityProps;
	updateIdentities: (id: string, key: string, prefs: string) => void;
	setMods: (mods: { [key: string]: unknown }) => void;
}

const PrimaryAccountSettings = ({
	t,
	items,
	updateIdentities,
	setMods
}: PrimaryAccountSettingsProps): ReactElement => {
	const emailLabel = useMemo(() => t('label.email_address', 'E-mail address'), [t]);
	const emailValue = useMemo(() => items?.fromAddress, [items]);
	const accountLabel = useMemo(() => t('label.account_name', 'Account Name'), [t]);
	const [accountNameValue, setAccountNameValue] = useState(items?.identityName);

	useEffect(() => setAccountNameValue(items.identityName), [items.identityName]);

	const onChangeDisabled = useCallback(() => null, []);
	const onChange = useCallback(
		(
			ev: MouseEvent & {
				target: HTMLButtonElement;
			}
		): void => {
			setAccountNameValue(ev.target.value);
			if (ev.target.value === items?.identityName) {
				setMods({});
			} else {
				updateIdentities(items.identityId, 'zimbraPrefIdentityName', ev.target.value);
			}
		},
		[items?.identityName, updateIdentities, setMods, items.identityId]
	);

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
					<Text weight="bold">{t('primary_account.title', 'Primary Account Settings')}</Text>
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
						label={emailLabel}
						value={emailValue || ' '}
						background="gray5"
						onChange={onChangeDisabled}
					/>
				</Row>
				<Row width="50%">
					<Input
						label={accountLabel}
						value={accountNameValue || ' '}
						background="gray5"
						onChange={(
							ev: MouseEvent & {
								target: HTMLButtonElement;
							}
						): void => onChange(ev)}
					/>
				</Row>
			</Row>
			<Padding bottom="large" />
		</>
	);
};

export default PrimaryAccountSettings;
