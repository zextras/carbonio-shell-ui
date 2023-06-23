/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act, screen, waitFor } from '@testing-library/react';
import { ResponseResolver, rest, RestContext, RestRequest } from 'msw';

import { Loader } from './loader';
import { LoginConfigStore } from '../../types/loginConfig';
import { LOGIN_V3_CONFIG_PATH } from '../constants';
import { getComponentsJson, GetComponentsJsonResponseBody } from '../mocks/handlers/components';
import { getInfoRequest } from '../mocks/handlers/getInfoRequest';
import { getLoginConfig } from '../mocks/handlers/login-config';
import server from '../mocks/server';
import { setup } from '../test/utils';

jest.mock('../workers');
jest.mock('../reporting/functions');

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

		setup(<Loader />);

		const title = await screen.findByText('Something went wrong...');
		act(() => {
			jest.runOnlyPendingTimers();
		});
		expect(title).toBeVisible();
	});

	test('If only getInfo request fails, the LoaderFailureModal appears', async () => {
		// TODO remove when SHELL-117 will be implemented
		const actualConsoleError = console.error;
		console.error = jest.fn<ReturnType<typeof console.error>, Parameters<typeof console.error>>(
			(error, ...restParameter) => {
				if (error === 'Unexpected end of JSON input') {
					// eslint-disable-next-line no-console
					console.log('Controlled error', error, ...restParameter);
				} else {
					actualConsoleError(error, ...restParameter);
				}
			}
		);
		// using getComponents and loginConfig default handlers
		server.use(
			rest.post('/service/soap/GetInfoRequest', (req, res, ctx) =>
				res(ctx.status(503, 'Controlled error: fail getInfo request'))
			)
		);

		setup(<Loader />);

		const title = await screen.findByText('Something went wrong...');
		act(() => {
			jest.runOnlyPendingTimers();
		});
		expect(title).toBeVisible();
	});

	test('If only loginConfig request fails, the LoaderFailureModal does not appear', async () => {
		const getComponentsJsonHandler = jest.fn(getComponentsJson);
		const getInfoHandler = jest.fn(getInfoRequest);
		type LoginConfigHandler = ResponseResolver<
			RestRequest<never, never>,
			RestContext,
			Partial<Omit<LoginConfigStore, 'loaded'>>
		>;
		const loginConfigHandler = jest.fn<
			ReturnType<LoginConfigHandler>,
			Parameters<LoginConfigHandler>
		>((req, res, ctx) => res(ctx.status(503)));
		server.use(
			rest.get('/static/iris/components.json', getComponentsJsonHandler),
			rest.post('/service/soap/GetInfoRequest', getInfoHandler),
			rest.get(LOGIN_V3_CONFIG_PATH, loginConfigHandler)
		);

		setup(<Loader />);

		await waitFor(() => expect(loginConfigHandler).toHaveBeenCalled());
		await waitFor(() => expect(getComponentsJsonHandler).toHaveBeenCalled());
		await waitFor(() => expect(getInfoHandler).toHaveBeenCalled());

		expect(screen.queryByText('Something went wrong...')).not.toBeInTheDocument();
	});

	test('If Loader requests do not fail, the LoaderFailureModal does not appear', async () => {
		const loginConfigHandler = jest.fn(getLoginConfig);
		const getComponentsJsonHandler = jest.fn(getComponentsJson);
		const getInfoHandler = jest.fn(getInfoRequest);

		server.use(
			rest.get('/static/iris/components.json', getComponentsJsonHandler),
			rest.post('/service/soap/GetInfoRequest', getInfoHandler),
			rest.get(LOGIN_V3_CONFIG_PATH, loginConfigHandler)
		);
		setup(<Loader />);

		await waitFor(() => expect(loginConfigHandler).toHaveBeenCalled());
		await waitFor(() => expect(getComponentsJsonHandler).toHaveBeenCalled());
		await waitFor(() => expect(getInfoHandler).toHaveBeenCalled());

		expect(screen.queryByText('Something went wrong...')).not.toBeInTheDocument();
	});
});
