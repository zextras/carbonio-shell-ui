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
	updateIdentities: (modifyList: {
		id: string | number;
		key: string;
		value: string | boolean;
	}) => void;
}

const PrimaryAccountSettings = ({
	t,
	items,
	updateIdentities
}: PrimaryAccountSettingsProps): ReactElement => {
	const emailValue = useMemo(() => items?.fromAddress, [items]);
	const emailLabel = useMemo(
		() => (emailValue ? '' : t('label.email_address', 'E-mail address')),
		[emailValue, t]
	);
	const [accountNameValue, setAccountNameValue] = useState(items?.identityName);

	useEffect(() => setAccountNameValue(items.identityName), [items.identityName]);
	const accountLabel = useMemo(
		() => (accountNameValue ? '' : t('label.account_name', 'Account Name')),
		[accountNameValue, t]
	);

	const onChangeDisabled = useCallback(() => null, []);
	const onChange = useCallback(
		(value: string): void => {
			setAccountNameValue(value);

			const modifyProp = {
				id: items.identityId,
				key: 'zimbraPrefIdentityName',
				value
			};

			updateIdentities(modifyProp);
		},
		[updateIdentities, items.identityId]
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
					<Input label={emailLabel} value={emailValue || ' '} onChange={onChangeDisabled} />
				</Row>
				<Row width="50%">
					<Input
						label={accountLabel}
						value={accountNameValue || ' '}
						onChange={(ev): void => onChange(ev.target.value)}
					/>
				</Row>
			</Row>
			<Padding bottom="large" />
		</>
	);
};

export default PrimaryAccountSettings;
