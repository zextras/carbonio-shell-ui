/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act, screen } from '@testing-library/react';
import { rest } from 'msw';

import { Loader } from './loader';
import { LOGIN_V3_CONFIG_PATH } from '../constants';
import { GetComponentsJsonResponseBody } from '../mocks/handlers/components';
import server, { waitForResponse } from '../mocks/server';
import { controlConsoleError, setup } from '../test/utils';

describe('Loader', () => {
	test('If only getComponents request fails, the LoaderFailureModal appears', async () => {
		// using getInfo and loginConfig default handlers
		server.use(
			rest.get<never, never, Partial<GetComponentsJsonResponseBody>>(
				'/static/iris/components.json',
				(req, res, ctx) =>
					res(ctx.status(503, 'Controlled error: fail components.json request'), ctx.json({}))
			)
		);

		const loginRes = waitForResponse('get', LOGIN_V3_CONFIG_PATH);
		const componentsRes = waitForResponse('get', '/static/iris/components.json');
		const getInfoRes = waitForResponse('post', '/service/soap/GetInfoRequest');

		setup(
			<span data-testid={'loader'}>
				<Loader />
			</span>
		);
		await loginRes;
		await screen.findByTestId('loader');
		await componentsRes;
		await getInfoRes;
		const title = await screen.findByText('Something went wrong...');
		act(() => {
			jest.runOnlyPendingTimers();
		});
		expect(title).toBeVisible();
	});

	test('If only getInfo request fails, the LoaderFailureModal appears', async () => {
		// TODO remove when SHELL-117 will be implemented
		controlConsoleError('Unexpected end of JSON input');
		// using getComponents and loginConfig default handlers
		server.use(
			rest.post('/service/soap/GetInfoRequest', (req, res, ctx) =>
				res(ctx.status(503, 'Controlled error: fail getInfo request'))
			)
		);
		const loginRes = waitForResponse('get', LOGIN_V3_CONFIG_PATH);
		const componentsRes = waitForResponse('get', '/static/iris/components.json');
		const getInfoRes = waitForResponse('post', '/service/soap/GetInfoRequest');
		setup(
			<span data-testid={'loader'}>
				<Loader />
			</span>
		);
		await loginRes;
		await screen.findByTestId('loader');
		await componentsRes;
		await getInfoRes;

		const title = await screen.findByText('Something went wrong...');
		act(() => {
			jest.runOnlyPendingTimers();
		});
		expect(title).toBeVisible();
	});

	test('If only loginConfig request fails, the LoaderFailureModal does not appear', async () => {
		server.use(rest.get(LOGIN_V3_CONFIG_PATH, (req, res, ctx) => res(ctx.status(503))));
		const loginRes = waitForResponse('get', LOGIN_V3_CONFIG_PATH);
		const componentsRes = waitForResponse('get', '/static/iris/components.json');
		const getInfoRes = waitForResponse('post', '/service/soap/GetInfoRequest');
		setup(
			<span data-testid={'loader'}>
				<Loader />
			</span>
		);
		await loginRes;
		await screen.findByTestId('loader');
		await componentsRes;
		await getInfoRes;
		expect(screen.queryByText('Something went wrong...')).not.toBeInTheDocument();
	});

	test('If Loader requests do not fail, the LoaderFailureModal does not appear', async () => {
		const loginRes = waitForResponse('get', LOGIN_V3_CONFIG_PATH);
		const componentsRes = waitForResponse('get', '/static/iris/components.json');
		const getInfoRes = waitForResponse('post', '/service/soap/GetInfoRequest');
		setup(
			<span data-testid={'loader'}>
				<Loader />
			</span>
		);
		await loginRes;
		await screen.findByTestId('loader');
		await componentsRes;
		await getInfoRes;

		expect(screen.queryByText('Something went wrong...')).not.toBeInTheDocument();
	});
});
