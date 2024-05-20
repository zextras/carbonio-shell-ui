/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { HttpResponseResolver } from 'msw';
import { HttpResponse } from 'msw';

export const zxAuthLogout: HttpResponseResolver<never, never, never> = () =>
	HttpResponse.json(
		{},
		{
			status: 302
		}
	);
