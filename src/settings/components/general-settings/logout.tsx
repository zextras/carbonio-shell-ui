/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ButtonOld as Button, FormSubSection } from '@zextras/carbonio-design-system';
import React, { FC, useCallback, useMemo } from 'react';
import { logout } from '../../../network/logout';
import { getT } from '../../../store/i18n';
import { accountSubSection } from '../../general-settings-sub-sections';

const Logout: FC = () => {
	const t = getT();
	const onClick = useCallback(() => {
		logout();
	}, []);
	const sectionTitle = useMemo(() => accountSubSection(t), [t]);
	return (
		<FormSubSection
			label={sectionTitle.label}
			minWidth="calc(min(100%, 32rem))"
			width="50%"
			id={sectionTitle.id}
		>
			<Button label={t('settings.general.account_logout', 'Logout')} onClick={onClick} />
		</FormSubSection>
	);
};

export default Logout;
