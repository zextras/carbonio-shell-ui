/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';

import { map } from 'lodash';

import { AccountsSettings } from './accounts-settings';
import { IdentityProps } from '../../types';
import { useUserAccount } from '../store/account';
import { getT } from '../store/i18n';

const AccountWrapper = (): React.ReactElement | null => {
	const accountSettings = useUserAccount();
	const t = getT();
	const identitiesDefault = useMemo(() => {
		const temp = map(
			accountSettings?.identities.identity,
			(item, index) =>
				({
					id: item.name === 'DEFAULT' ? '0' : (index + 1).toString(),
					flgType: item.name === 'DEFAULT' ? 'primary' : 'persona',
					type:
						item.name === 'DEFAULT' ? t('label.primary', 'Primary') : t('label.persona', 'Persona'),
					identityId: item._attrs.zimbraPrefIdentityId || '',
					fromAddress: item._attrs.zimbraPrefFromAddress || '',
					identityName: item._attrs.zimbraPrefIdentityName || '',
					fromDisplay: item._attrs.zimbraPrefFromDisplay || '',
					recoveryAccount: item._attrs.zimbraRecoveryAccount || '',
					replyToDisplay: item._attrs.zimbraPrefReplyToDisplay || '',
					replyToAddress: item._attrs.zimbraPrefReplyToAddress || '',
					replyToEnabled: item._attrs.zimbraPrefReplyToEnabled || '',
					saveToSent: item._attrs.zimbraPrefSaveToSent || '',
					sentMailFolder: item._attrs.zimbraPrefSentMailFolder || '',
					whenInFoldersEnabled: item._attrs.zimbraPrefWhenInFoldersEnabled || '',
					whenSentToEnabled: item._attrs.zimbraPrefWhenSentToEnabled || '',
					whenSentToAddresses: item._attrs.zimbraPrefWhenSentToAddresses || ''
				} as IdentityProps)
		);
		const result = [temp[temp.length - 1], ...temp];
		result.pop();
		return result;
	}, [accountSettings, t]);

	return identitiesDefault.length > 0 ? (
		<AccountsSettings account={accountSettings} identitiesDefault={identitiesDefault} t={t} />
	) : null;
};

export default AccountWrapper;
