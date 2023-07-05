/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { ResponseResolver, RestContext, RestRequest } from 'msw';

import { logout } from './logout';

export const rootHandler: ResponseResolver<RestRequest, RestContext> = (req, res, ctx) => {
	if (req.url.searchParams.get('loginOp') === 'logout') {
		return logout(req, res, ctx);
	}

	return req.passthrough();
};
