/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { rest } from 'msw';
import { getInfo } from './get-info';
import server from '../mocks/server';
import { CarbonioModule } from '../../types';
import { GetComponentsJsonResponseBody } from '../mocks/handlers/components';
import { useAppStore } from '../store/app';

jest.mock('../workers');
describe('Get info', () => {
	test('Setup apps and request data for the logged account', async () => {
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
				(req, res, ctx) =>
					res(
						ctx.json({
							components: apps
						})
					)
			)
		);
		await getInfo();
		expect(useAppStore.getState().apps[carbonioModule.name]).toEqual(carbonioModule);
		expect(useAppStore.getState().shell).toEqual(shellModule);
	});
});
