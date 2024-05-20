/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { type RequestHandler, http, HttpResponse } from 'msw';

import { getComponentsJson } from './handlers/components';
import { endSessionRequest } from './handlers/endSessionRequest';
import { getInfoRequest } from './handlers/getInfoRequest';
import { getRightsRequest } from './handlers/getRightsRequest';
import { getLoginConfig } from './handlers/login-config';
import { logout } from './handlers/logout';
import { zxAuthLogout } from './handlers/zx-auth-logout';
import { LOGIN_V3_CONFIG_PATH } from '../constants';

const handlers: RequestHandler[] = [
	http.get('/static/iris/components.json', getComponentsJson),
	http.post('/service/soap/GetInfoRequest', getInfoRequest),
	http.post('/service/soap/GetRightsRequest', getRightsRequest),
	http.post('/service/soap/EndSessionRequest', endSessionRequest),
	http.get(LOGIN_V3_CONFIG_PATH, getLoginConfig),
	http.get('/i18n/en.json', () => HttpResponse.json({})),
	http.get('/logout', logout),
	http.get('/zx/auth/logout', zxAuthLogout)
];

export default handlers;
