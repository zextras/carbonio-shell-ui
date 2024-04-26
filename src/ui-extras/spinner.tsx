/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { Button, Container } from '@zextras/carbonio-design-system';
import { noop } from 'lodash';

export const Spinner = (): React.JSX.Element => (
	<Container width="fill" height="fill" mainAlignment="center" crossAlignment="center">
		{/* the "Button" string doesn't need to be translated as it's not rendered */}
		<Button type="ghost" label="Button" color="primary" loading onClick={noop} />
	</Container>
);
