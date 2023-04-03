/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { type RequestHandler, rest } from 'msw';
import { getComponentsJson } from './handlers/components';
import { getInfoRequest } from './handlers/getInfoRequest';

const handlers: RequestHandler[] = [
	rest.get('/static/iris/components.json', getComponentsJson),
	rest.post('/service/soap/GetInfoRequest', getInfoRequest)
];

export default handlers;
