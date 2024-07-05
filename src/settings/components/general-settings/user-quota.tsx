/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { FC } from 'react';
import React, { useMemo } from 'react';

import { Container, FormSubSection, Quota, Text, Tooltip } from '@zextras/carbonio-design-system';

import { useAccountStore, useUserSettings } from '../../../store/account';
import { getT } from '../../../store/i18n/hooks';
import { quotaSubSection } from '../../general-settings-sub-sections';
import { humanFileSize } from '../utils';

interface UserQuotaProps {
	mobileView: boolean;
}

const UserQuota: FC<UserQuotaProps> = ({ mobileView }) => {
	const t = getT();

	const settings = useUserSettings();
	const used = useAccountStore((s) => s.usedQuota);
	const limit = Number(settings?.attrs?.zimbraMailQuota);
	const quota = useMemo(() => {
		if (limit > 0) {
			return Math.round((used / limit) * 100);
		}
		return -1;
	}, [limit, used]);

	const filledQuota = useMemo(() => {
		if (quota === -1 || quota >= 100) {
			return 100;
		}
		return quota;
	}, [quota]);

	const description = useMemo(() => {
		if (quota < 0) {
			return t('user_quota.unlimited', '{{used}} of unlimited space', {
				replace: {
					used: humanFileSize(used)
				}
			});
		}
		return t('user_quota.limited', {
			defaultValue: '{{used}} of {{limit}} used',
			replace: {
				used: humanFileSize(used),
				limit: humanFileSize(limit)
			}
		});
	}, [limit, quota, t, used]);

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
				<Quota fill={filledQuota} fillBackground={fillBackground} />
			</Tooltip>
		</Container>
	) : (
		<FormSubSection
			label={sectionTitle.label}
			minWidth="calc(min(100%, 32rem))"
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
				<Quota fill={filledQuota} fillBackground={fillBackground} />
			</Container>
		</FormSubSection>
	);
};

export default UserQuota;
