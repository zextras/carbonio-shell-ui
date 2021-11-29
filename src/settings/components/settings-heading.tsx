/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC } from 'react';
import { Padding, Row, Text } from '@zextras/zapp-ui';

const Heading: FC<{ title: string }> = ({ title }) => (
	<>
		<Row padding={{ all: 'small' }} mainAlignment="baseline" crossAlignment="baseline" width="100%">
			<Text size="large" weight="bold">
				{title}
			</Text>
		</Row>
		<Padding veritcal="small" />
	</>
);

export default Heading;
