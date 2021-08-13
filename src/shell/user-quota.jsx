/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import React, { useMemo } from 'react';
import { Tooltip, Quota, Container } from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import { useUserAccounts } from '../store/shell-store-hooks';

export const UserQuota = () => {
	const [t] = useTranslation();

	const [account] = useUserAccounts();

	const quota = useMemo(() => {
		const userQuota = account.settings?.attrs?.zimbraMailQuota;
		const used = account.settings?.used;
		if (used && userQuota) {
			return Math.floor((used / userQuota) * 100);
		}
		return -used;
	}, [account]);

	const label = useMemo(() => {
		if (quota < 0) {
			return t('user_quota.unlimited', 'Unlimited space available');
		}
		return t('user_quota.limited', { default: '{{quota}}% space used', quota });
	}, [quota, t]);

	const fillBackground = useMemo(
		// eslint-disable-next-line no-nested-ternary
		() => (quota < 90 ? 'primary' : quota < 95 ? 'warning' : 'error'),
		[quota]
	);

	return (
		<Container width="fit" padding={{ right: 'medium' }}>
			<Tooltip label={label}>
				<Quota fill={quota > 0 ? quota : 0} fillBackground={fillBackground} />
			</Tooltip>
		</Container>
	);
};
