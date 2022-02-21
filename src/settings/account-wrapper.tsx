/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';
import { map } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useUserAccount } from '../shell/hooks';
import { AccountsSettings } from './accounts-settings';

const AccountWrapper = (): React.ReactElement | null => {
	const accountSettings = useUserAccount();
	const [t] = useTranslation();
	const identitiesDefault = useMemo(() => {
		const temp = map(accountSettings?.identities.identity, (item, index) => ({
			id: item.name === 'DEFAULT' ? '0' : (index + 1).toString(),
			type: item.name === 'DEFAULT' ? t('label.primary', 'Primary') : t('label.persona', 'Persona'),
			identityId: item._attrs.zimbraPrefIdentityId,
			fromAddress: item._attrs.zimbraPrefFromAddress,
			identityName: item._attrs.zimbraPrefIdentityName,
			fromDisplay: item._attrs.zimbraPrefFromDisplay,
			recoveryAccount: item._attrs.zimbraRecoveryAccount,
			replyToDisplay: item._attrs.zimbraPrefReplyToDisplay,
			replyToAddress: item._attrs.zimbraPrefReplyToAddress,
			replyToEnabled: item._attrs.zimbraPrefReplyToEnabled,
			saveToSent: item._attrs.zimbraPrefSaveToSent,
			sentMailFolder: item._attrs.zimbraPrefSentMailFolder,
			whenInFoldersEnabled: item._attrs.zimbraPrefWhenInFoldersEnabled,
			whenSentToEnabled: item._attrs.zimbraPrefWhenSentToEnabled,
			whenSentToAddresses: item._attrs.zimbraPrefWhenSentToAddresses
		}));
		const result = [temp[temp.length - 1], ...temp];
		result.pop();
		return result;
	}, [accountSettings, t]);

	return identitiesDefault.length > 0 ? (
		<AccountsSettings identitiesDefault={identitiesDefault} t={t} />
	) : null;
};

export default AccountWrapper;
