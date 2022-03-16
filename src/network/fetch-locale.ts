/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AvailableLocalesResponse } from '../../types';
import { SHELL_APP_ID } from '../constants';
import { useAccountStore } from '../store/account';
import { getSoapFetch } from './fetch';

export const fetchLocales = (): Promise<any> =>
	getSoapFetch(SHELL_APP_ID)<{ _jsns: string }, AvailableLocalesResponse>('GetAvailableLocales', {
		_jsns: 'urn:zimbraAccount'
	});
