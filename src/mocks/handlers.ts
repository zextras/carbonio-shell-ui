/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { type RequestHandler, http, HttpResponse } from 'msw';

import { LOGIN_V3_CONFIG_PATH } from '../constants';
import { getComponentsJson } from './handlers/components';
import { getLoginConfig } from './handlers/login-config';
import { logout } from './handlers/logout';
import { noOpRequest } from './handlers/noOpRequest';

const handlers: RequestHandler[] = [
	http.get('/static/iris/components.json', getComponentsJson),
	http.post('/service/soap/NoOpRequest', noOpRequest),
	http.get(LOGIN_V3_CONFIG_PATH, getLoginConfig),
	http.get('/i18n/en.json', () => HttpResponse.json({})),
	http.get('/logout', logout)
];

export default handlers;
