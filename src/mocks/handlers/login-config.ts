/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { ResponseResolver, RestContext, RestRequest } from 'msw';
import { LoginConfigStore } from '../../../types/loginConfig';

export const getLoginConfig: ResponseResolver<
	RestRequest<never, never>,
	RestContext,
	Partial<Omit<LoginConfigStore, 'loaded'>>
> = (req, res, ctx) =>
	res(
		ctx.json({
			carbonioWebUiTitle: 'Carbonio Client',
			carbonioWebUiFavicon: `${BASE_PATH}favicon.png`
		})
	);
