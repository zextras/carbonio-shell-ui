/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo, useCallback, ReactElement, useState, useEffect } from 'react';

import { Container, Text, Padding, Input, Row, InputProps } from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';

import { Account, IdentityAttrs, IdentityProps } from '../../../../types';

interface PrimaryAccountSettingsProps {
	t: TFunction;
	account: Account;
	identity: IdentityProps;
	updateIdentities: <K extends keyof IdentityAttrs>(
		id: string | number,
		key: K,
		value: IdentityAttrs[K]
	) => void;
}

const PrimaryAccountSettings = ({
	t,
	account,
	identity,
	updateIdentities
}: PrimaryAccountSettingsProps): ReactElement => {
	const emailLabel = useMemo(() => t('label.email_address', 'E-mail address'), [t]);
	const [accountNameValue, setAccountNameValue] = useState(identity?.identityName);

	useEffect(() => setAccountNameValue(identity.identityName), [identity.identityName]);
	const accountLabel = useMemo(() => t('label.account_name', 'Account Name'), [t]);

	const onChangeDisabled = useCallback(() => null, []);
	const onChange = useCallback<NonNullable<InputProps['onChange']>>(
		(ev): void => {
			setAccountNameValue(ev.target.value);
			updateIdentities(identity.identityId, 'zimbraPrefIdentityName', ev.target.value);
		},
		[updateIdentities, identity.identityId]
	);

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
					<Input label={emailLabel} value={account.name || ' '} onChange={onChangeDisabled} />
				</Row>
				<Row width="50%">
					<Input label={accountLabel} value={accountNameValue} onChange={onChange} />
				</Row>
			</Row>
			<Padding bottom="large" />
		</>
	);
};

export default PrimaryAccountSettings;
