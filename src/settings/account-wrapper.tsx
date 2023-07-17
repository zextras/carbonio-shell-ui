/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';

import { TFunction, TOptions } from 'i18next';
import { map } from 'lodash';

import { AccountsSettings } from './accounts-settings';
import { Account, IdentityProps } from '../../types';
import { useUserAccount } from '../store/account';
import { getT } from '../store/i18n';

const tDefault = (key: string, defaultValue?: string | TOptions): string => {
	if (typeof defaultValue === 'string') {
		return defaultValue;
	}
	return defaultValue?.defaultValue || key;
};

export const identityToIdentityProps = (
	identity: Account['identities']['identity'][0],
	index: number,
	t: TFunction | typeof tDefault = tDefault
): IdentityProps => ({
	id: identity.name === 'DEFAULT' ? '0' : (index + 1).toString(),
	flgType: identity.name === 'DEFAULT' ? 'primary' : 'persona',
	type: identity.name === 'DEFAULT' ? t('label.primary', 'Primary') : t('label.persona', 'Persona'),
	identityId: identity._attrs?.zimbraPrefIdentityId || '',
	fromAddress: identity._attrs?.zimbraPrefFromAddress || '',
	identityName: identity._attrs?.zimbraPrefIdentityName || '',
	fromDisplay: identity._attrs?.zimbraPrefFromDisplay || '',
	replyToDisplay: identity._attrs?.zimbraPrefReplyToDisplay || '',
	replyToAddress: identity._attrs?.zimbraPrefReplyToAddress || '',
	replyToEnabled: identity._attrs?.zimbraPrefReplyToEnabled || '',
	saveToSent: identity._attrs?.zimbraPrefSaveToSent || '',
	sentMailFolder: identity._attrs?.zimbraPrefSentMailFolder || '',
	whenInFoldersEnabled: identity._attrs?.zimbraPrefWhenInFoldersEnabled || '',
	whenSentToEnabled: identity._attrs?.zimbraPrefWhenSentToEnabled || ''
});

const AccountWrapper = (): React.ReactElement | null => {
	const accountSettings = useUserAccount();
	const t = getT();
	const identitiesDefault = useMemo(() => {
		const temp = map(accountSettings?.identities.identity, (item, index) =>
			identityToIdentityProps(item, index, t)
		);
		const result = [temp[temp.length - 1], ...temp];
		result.pop();
		return result;
	}, [accountSettings, t]);

	return identitiesDefault.length > 0 ? (
		<AccountsSettings account={accountSettings} identitiesDefault={identitiesDefault} />
	) : null;
};

export default AccountWrapper;
