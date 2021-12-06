/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';
import { Tooltip, Quota, Container } from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import { useUserSettings } from '../store/account/hooks';
import { useAccountStore } from '../store/account/store';

export const UserQuota = () => {
	const [t] = useTranslation();

	const settings = useUserSettings();
	const used = useAccountStore((s) => s.usedQuota);
	const quota = useMemo(() => {
		const userQuota = settings?.attrs?.zimbraMailQuota;
		console.log('quota:', used, userQuota);
		if (used && userQuota && userQuota > 0) {
			return Math.floor((used / userQuota) * 100);
		}
		return -1;
	}, [settings?.attrs?.zimbraMailQuota, used]);

	const label = useMemo(() => {
		if (!quota || quota < 0) {
			return t('user_quota.unlimited', 'Unlimited space available');
		}
		return t('user_quota.limited', { defaultValue: '{{quota}}% space used', quota });
	}, [quota, t]);

	const fillBackground = useMemo(
		// eslint-disable-next-line no-nested-ternary
		() => (quota < 90 ? 'primary' : quota < 95 ? 'warning' : 'error'),
		[quota]
	);

	return (
		<Container width="fit" padding={{ right: 'medium' }}>
			<Tooltip label={label} placement="bottom">
				<Quota fill={quota > 0 ? quota : 0} fillBackground={fillBackground} />
			</Tooltip>
		</Container>
	);
};
