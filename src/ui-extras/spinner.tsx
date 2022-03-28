/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC } from 'react';
import { Button, Container } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

export const Spinner: FC = () => {
	const [t] = useTranslation();
	return (
		<Container width="fill" height="fill" mainAlignment="center" crossAlignment="center">
			<Button type="ghost" label={t('button', 'Button')} color="primary" loading />
		</Container>
	);
};
