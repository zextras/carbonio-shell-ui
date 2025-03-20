/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { JSNS } from '../constants';
import { legacySoapFetch } from '../fetch/fetch';
import type { AvailableLocalesResponse, SoapBody } from '../types/network';

export const fetchLocales = (): Promise<AvailableLocalesResponse> =>
	legacySoapFetch<SoapBody, AvailableLocalesResponse>('GetAvailableLocales', {
		_jsns: JSNS.account
	});
