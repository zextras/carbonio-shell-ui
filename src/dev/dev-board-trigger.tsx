/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC } from 'react';
import { IconButton } from '@zextras/carbonio-design-system';
import { addBoard } from '../store/boards';
import { SHELL_APP_ID } from '../constants';

const DevBoardTrigger: FC = () => (
	<IconButton
		icon="Code"
		size="large"
		onClick={(): void => {
			addBoard(SHELL_APP_ID)({ url: '/devtools/', title: 'Dev Tools' });
		}}
	/>
);

export default DevBoardTrigger;
