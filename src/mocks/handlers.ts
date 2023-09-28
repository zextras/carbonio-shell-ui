/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { type RequestHandler, rest } from 'msw';

import { getComponentsJson } from './handlers/components';
import { endSessionRequest } from './handlers/endSessionRequest';
import { getInfoRequest } from './handlers/getInfoRequest';
import { getRightsRequest } from './handlers/getRightsRequest';
import { getLoginConfig } from './handlers/login-config';
import { logout } from './handlers/logout';
import { LOGIN_V3_CONFIG_PATH } from '../constants';

const handlers: RequestHandler[] = [
	rest.get('/static/iris/components.json', getComponentsJson),
	rest.post('/service/soap/GetInfoRequest', getInfoRequest),
	rest.post('/service/soap/GetRightsRequest', getRightsRequest),
	rest.post('/service/soap/EndSessionRequest', endSessionRequest),
	rest.get(LOGIN_V3_CONFIG_PATH, getLoginConfig),
	rest.get('/i18n/en.json', (request, response, context) => response(context.json({}))),
	rest.get('/logout', logout)
];

export default handlers;
