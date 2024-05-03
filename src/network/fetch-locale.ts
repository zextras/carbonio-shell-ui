/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getSoapFetch } from './fetch';
import { JSNS, SHELL_APP_ID } from '../constants';
import type { AvailableLocalesResponse, SoapBody } from '../types/network';

export const fetchLocales = (): Promise<AvailableLocalesResponse> =>
	getSoapFetch(SHELL_APP_ID)<SoapBody, AvailableLocalesResponse>('GetAvailableLocales', {
		_jsns: JSNS.account
	});
