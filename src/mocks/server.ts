/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { matchRequestUrl, MockedRequest } from 'msw';
import { setupServer } from 'msw/node';

import { matchRequestUrl, MockedRequest } from 'msw';
import handlers from './handlers';

const server = setupServer(...handlers);
export default server;

export function waitForRequest(method: string, url: string): Promise<MockedRequest> {
	let requestId = '';

	return new Promise<MockedRequest>((resolve, reject) => {
		server.events.on('request:start', (req) => {
			const matchesMethod = req.method.toLowerCase() === method.toLowerCase();
			const matchesUrl = matchRequestUrl(req.url, url).matches;

			if (matchesMethod && matchesUrl) {
				requestId = req.id;
			}
		});

		server.events.on('request:match', (req) => {
			if (req.id === requestId) {
				resolve(req);
			}
		});

		server.events.on('request:unhandled', (req) => {
			if (req.id === requestId) {
				reject(new Error(`The ${req.method} ${req.url.href} request was unhandled.`));
			}
		});
	});
}
