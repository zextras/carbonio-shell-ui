/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { LifeCycleEventsMap } from 'msw';
import { matchRequestUrl } from 'msw';
import { setupServer } from 'msw/node';

import handlers from './handlers';

const server = setupServer(...handlers);
export default server;

export function waitForRequest(method: string, url: string): Promise<Request> {
	let requestId = '';

	return new Promise((resolve, reject) => {
		server.events.on('request:start', (info) => {
			const matchesMethod = info.request.method.toLowerCase() === method.toLowerCase();
			const { matches: matchesUrl } = matchRequestUrl(new URL(info.request.url), url);

			if (matchesMethod && matchesUrl) {
				requestId = info.requestId;
			}
		});

		server.events.on('request:match', (info) => {
			if (info.requestId === requestId) {
				resolve(info.request);
			}
		});

		server.events.on('request:unhandled', (info) => {
			if (info.requestId === requestId) {
				reject(new Error(`The ${info.request.method} ${info.request.url} request was unhandled.`));
			}
		});
	});
}

export function waitForResponse(
	method: string,
	url: string
): Promise<LifeCycleEventsMap['response:mocked'][0]['response']> {
	let requestId = '';

	return new Promise((resolve, reject) => {
		server.events.on('request:start', (info) => {
			const matchesMethod = info.request.method.toLowerCase() === method.toLowerCase();
			const matchesUrl = matchRequestUrl(new URL(info.request.url), url).matches;

			if (matchesMethod && matchesUrl) {
				requestId = info.requestId;
			}
		});

		server.events.on('response:mocked', (info) => {
			if (info.requestId === requestId) {
				resolve(info.response);
			}
		});

		server.events.on('request:unhandled', (info) => {
			if (info.requestId === requestId) {
				reject(new Error(`The ${info.request.method} ${info.request.url} request was unhandled.`));
			}
		});
	});
}
