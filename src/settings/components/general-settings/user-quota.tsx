/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useMemo } from 'react';
import { Quota, Container, FormSubSection, Text, Tooltip } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { useUserSettings } from '../../../store/account/hooks';
import { useAccountStore } from '../../../store/account/store';
import { quotaSubSection } from '../../general-settings-sub-sections';

interface UserQuotaProps {
	mobileView: boolean;
}

const UserQuota: FC<UserQuotaProps> = ({ mobileView }) => {
	const [t] = useTranslation();

	const settings = useUserSettings();
	const used = useAccountStore((s) => s.usedQuota);
	const quota = useMemo(() => {
		const userQuota = Number(settings?.attrs?.zimbraMailQuota);
		if (used && userQuota && userQuota > 0) {
			return Math.round((used / userQuota) * 100);
		}
		return -1;
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
	const sectionTitle = useMemo(() => quotaSubSection(t), [t]);
	return mobileView ? (
		<Container width="fit" padding={{ right: 'medium' }}>
			<Tooltip label={description} placement="bottom">
				<Quota fill={quota > 0 ? quota : 0} fillBackground={fillBackground} />
			</Tooltip>
		</Container>
	) : (
		<FormSubSection
			label={sectionTitle.label}
			minWidth="calc(min(100%, 512px))"
			width="50%"
			id={sectionTitle.id}
		>
			<Container width="fill" padding={{ vertical: 'medium' }}>
				<Container
					orientation="horizontal"
					mainAlignment="flex-start"
					padding={{ bottom: 'medium' }}
				>
					<Text>{description}</Text>
				</Container>
				<Quota fill={quota === -1 ? 100 : quota} fillBackground={fillBackground} />
			</Container>
		</FormSubSection>
	);
};

export default UserQuota;
