/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { rest } from 'msw';
import { act, screen } from '@testing-library/react';
import React from 'react';
import server from '../mocks/server';
import { GetComponentsJsonResponseBody } from '../mocks/handlers/components';
import { setup } from '../test/utils';
import { Loader } from './loader';
import { LOGIN_V3_CONFIG_PATH } from '../constants';

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
		// using getComponents and loginConfig default handlers
		// TODO update when SHELL-117 will be implemented
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

	test('If only loginConfig request fails, the LoaderFailureModal does not appears', async () => {
		// using getComponents and getInfo default handlers
		server.use(rest.post(LOGIN_V3_CONFIG_PATH, (req, res, ctx) => res(ctx.status(503))));

		setup(<Loader />);

		expect(screen.queryByText('Something went wrong...')).not.toBeInTheDocument();
	});

	test('If Loader requests do not fail, the LoaderFailureModal does not appear', async () => {
		// using getComponents, loginConfig and getInfo default handlers

		setup(<Loader />);

		expect(screen.queryByText('Something went wrong...')).not.toBeInTheDocument();
	});
});
