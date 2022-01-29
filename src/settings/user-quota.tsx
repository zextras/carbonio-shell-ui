/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo, ReactElement } from 'react';
import { Quota, Container, FormSubSection, Text, Tooltip } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { useUserSettings } from '../store/account';
import { useAccountStore } from '../store/account';

interface UserQuotaProps {
	mobileView: boolean;
}

const UserQuota = (mobileView: UserQuotaProps): ReactElement => {
	const [t] = useTranslation();

	const settings = useUserSettings();
	const used = Number(useAccountStore((s) => s.usedQuota));
	const quota = useMemo(() => {
		const userQuota = Number(settings?.attrs?.zimbraMailQuota);
		if (used && userQuota && userQuota > 0) {
			return Math.floor((used / userQuota) * 100);
		}
		return 100;
	}, [settings?.attrs?.zimbraMailQuota, used]);

	const description = useMemo(() => {
		switch (true) {
			case !quota || quota < 0:
				return t('user_quota.unlimited', 'You have unlimited space available');
			case quota === 100:
				return t('user_quota.space_full', 'It seems that all available space is full');
			default:
				return t('user_quota.limited', {
					defaultValue: 'You have filled {{quota}}% of the available space',
					quota
				});
		}
	}, [quota, t]);

	const fillBackground = useMemo(() => {
		switch (true) {
			case quota >= 95:
				return 'error';
			case quota >= 90:
				return 'warning';
			case quota === -1:
				return 'gray4';
			default:
				return 'primary';
		}
	}, [quota]);

	return mobileView ? (
		<>
			<Container width="fit" padding={{ right: 'medium' }}>
				<Tooltip label={description} placement="bottom">
					<Quota fill={quota > 0 ? quota : 0} fillBackground={fillBackground} />
				</Tooltip>
			</Container>
		</>
	) : (
		<>
			<FormSubSection
				label={t('user_quota.title', "User's quota")}
				minWidth="calc(min(100%, 512px))"
				width="50%"
			>
				<Container width="fill" padding={{ vertical: 'medium' }}>
					<Container
						orientation="horizontal"
						mainAlignment="flex-start"
						takeAvailableSpace
						padding={{ bottom: 'medium' }}
					>
						<Text orientation="left">{description}</Text>
					</Container>
					<Quota fill={quota === -1 ? 100 : quota} fillBackground={fillBackground} />
				</Container>
			</FormSubSection>
		</>
	);
};

export default UserQuota;
