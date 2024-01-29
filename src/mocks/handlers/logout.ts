/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { HttpResponse, HttpResponseResolver } from 'msw';

export const logout: HttpResponseResolver<never, never, never> = () =>
	HttpResponse.json(
		{},
		{
			status: 307,
			statusText: 'Temporary Redirect',
			headers: {
				Location: 'https://localhost/static/login/'
			}
		}
	);
