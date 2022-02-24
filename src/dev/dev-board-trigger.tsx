/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC } from 'react';
import { IconButton } from '@zextras/carbonio-design-system';
import { useContextBridge } from '../store/context-bridge';
import { SHELL_APP_ID } from '../../types';

const DevBoardTrigger: FC = () => (
	<IconButton
		icon="Code"
		size="large"
		onClick={(): void =>
			useContextBridge.getState().packageDependentFunctions?.addBoard(SHELL_APP_ID)('/devtools/', {
				title: 'Dev Tools'
			})
		}
	/>
);

export default DevBoardTrigger;
