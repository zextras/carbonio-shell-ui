/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormSubSection, Button } from '@zextras/carbonio-design-system';
import { logout } from '../../../network/logout';

const Logout: FC = () => {
	const [t] = useTranslation();
	const onClick = useCallback(() => {
		logout();
	}, []);
	return (
		<FormSubSection
			label={t('settings.general.account', 'Account')}
			minWidth="calc(min(100%, 512px))"
			width="50%"
		>
			<Button label={t('settings.general.account_logout', 'Logout')} onClick={onClick} />
		</FormSubSection>
	);
};

export default Logout;
