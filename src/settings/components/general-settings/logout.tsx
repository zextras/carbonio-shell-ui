/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormSubSection, ButtonOld as Button } from '@zextras/carbonio-design-system';
import { logout } from '../../../network/logout';
import { accountSubSection } from '../../general-settings-sub-sections';

const Logout: FC = () => {
	const [t] = useTranslation();
	const onClick = useCallback(() => {
		logout();
	}, []);
	const sectionTitle = useMemo(() => accountSubSection(t), [t]);
	return (
		<FormSubSection
			label={sectionTitle.label}
			minWidth="calc(min(100%, 512px))"
			width="50%"
			id={sectionTitle.id}
		>
			<Button label={t('settings.general.account_logout', 'Logout')} onClick={onClick} />
		</FormSubSection>
	);
};

export default Logout;
