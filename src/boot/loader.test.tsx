/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { rest } from 'msw';
import { act, screen } from '@testing-library/react';
import React from 'react';
import server from '../mocks/server';
import { CarbonioModule } from '../../types';
import { GetComponentsJsonResponseBody } from '../mocks/handlers/components';
import { setup } from '../test/utils';
import { Loader } from './loader';
import { report } from '../reporting';

jest.mock('../workers');
jest.mock('../reporting/functions');
describe('Loader', () => {
	test.skip('Setup ', async () => {
		const shellModule: CarbonioModule = {
			commit: '',
			description: 'Description for the shell module',
			js_entrypoint: '',
			version: '',
			name: 'carbonio-shell-ui',
			type: 'shell',
			priority: -1,
			display: 'Shell',
			icon: 'CubeOutline',
			attrKey: '',
			sentryDsn: ''
		};
		const carbonioModule: CarbonioModule = {
			commit: '',
			description: 'Description for the other module',
			js_entrypoint: '',
			version: '',
			name: 'carbonio-module-ui',
			type: 'carbonio',
			priority: 1,
			display: 'Module',
			icon: 'People',
			attrKey: '',
			sentryDsn: ''
		};
		const apps: CarbonioModule[] = [shellModule, carbonioModule];

		server.use(
			rest.get<never, never, GetComponentsJsonResponseBody>(
				'/static/iris/components.json',
				(req, res, ctx) => res(ctx.status(503))
			)
		);

		setup(<Loader />);

		const title = await screen.findByText('Something went wrong...');
		act(() => {
			jest.runOnlyPendingTimers();
		});
		expect(title).toBeVisible();
	});

	test.skip('getInfo ', async () => {
		const shellModule: CarbonioModule = {
			commit: '',
			description: 'Description for the shell module',
			js_entrypoint: '',
			version: '',
			name: 'carbonio-shell-ui',
			type: 'shell',
			priority: -1,
			display: 'Shell',
			icon: 'CubeOutline',
			attrKey: '',
			sentryDsn: ''
		};
		const carbonioModule: CarbonioModule = {
			commit: '',
			description: 'Description for the other module',
			js_entrypoint: '',
			version: '',
			name: 'carbonio-module-ui',
			type: 'carbonio',
			priority: 1,
			display: 'Module',
			icon: 'People',
			attrKey: '',
			sentryDsn: ''
		};
		const apps: CarbonioModule[] = [shellModule, carbonioModule];

		server.use(rest.post('/service/soap/GetInfoRequest', (req, res, ctx) => res(ctx.status(503))));

		setup(<Loader />);

		const title = await screen.findByText('Something went wrong...');
		act(() => {
			jest.advanceTimersByTime(100);
		});
		expect(title).toBeVisible();
	});
});
