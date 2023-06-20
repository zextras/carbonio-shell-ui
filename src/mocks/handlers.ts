/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { type RequestHandler, rest } from 'msw';
import { getComponentsJson } from './handlers/components';
import { getInfoRequest } from './handlers/getInfoRequest';
import { LOGIN_V3_CONFIG_PATH } from '../constants';
import { LoginConfigStore } from '../../types/loginConfig';

const handlers: RequestHandler[] = [
	rest.get('/static/iris/components.json', getComponentsJson),
	rest.post('/service/soap/GetInfoRequest', getInfoRequest),
	rest.get<never, never, Partial<LoginConfigStore>>(LOGIN_V3_CONFIG_PATH, (req, res, ctx) =>
		res(
			ctx.json({
				carbonioWebUiTitle: 'Carbonio Client',
				carbonioWebUiFavicon: `${BASE_PATH}favicon.png`
			})
		)
	),
	rest.get('/i18n/en.json', (request, response, context) => response(context.json({})))
];

export default handlers;
