/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { matchRequestUrl, MockedRequest } from 'msw';
import { ServerLifecycleEventsMap, setupServer } from 'msw/node';

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

export function waitForResponse(
	method: string,
	url: string
): Promise<ServerLifecycleEventsMap['response:mocked'][0]> {
	let requestId = '';

	return new Promise((resolve, reject) => {
		server.events.on('request:start', (req) => {
			const matchesMethod = req.method.toLowerCase() === method.toLowerCase();
			const matchesUrl = matchRequestUrl(req.url, url).matches;

			if (matchesMethod && matchesUrl) {
				requestId = req.id;
			}
		});

		server.events.on('response:mocked', (res, reqId) => {
			if (reqId === requestId) {
				resolve(res);
			}
		});

		server.events.on('request:unhandled', (req) => {
			if (req.id === requestId) {
				reject(new Error(`The ${req.method} ${req.url.href} request was unhandled.`));
			}
		});
	});
}
