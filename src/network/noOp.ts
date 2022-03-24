/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetState } from 'zustand';
import { AccountState } from '../../types';
import { SHELL_APP_ID } from '../constants';

export const noOp = (get: GetState<AccountState>): void => {
	get().soapFetch(SHELL_APP_ID)('NoOp', { _jsns: 'urn:zimbraMail' });
};
