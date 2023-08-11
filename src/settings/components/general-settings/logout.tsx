/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';

import { Button, FormSubSection } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

import { logout } from '../../../network/logout';
import { accountSubSection } from '../../general-settings-sub-sections';

export const Logout = (): React.JSX.Element => {
	const [t] = useTranslation();

	const sectionTitle = useMemo(() => accountSubSection(t), [t]);

	return (
		<FormSubSection
			label={sectionTitle.label}
			minWidth="calc(min(100%, 32rem))"
			width="50%"
			id={sectionTitle.id}
		>
			<Button label={t('settings.general.account_logout', 'Logout')} onClick={logout} />
		</FormSubSection>
	);
};
