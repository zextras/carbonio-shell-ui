/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { ResponseResolver, RestContext, RestRequest } from 'msw';

export const logout: ResponseResolver<RestRequest, RestContext> = (req, res, ctx) =>
	res(
		ctx.status(304, 'Temporary Redirect'),
		ctx.json({}),
		ctx.set('location', 'https://localhost/static/login/')
	);
