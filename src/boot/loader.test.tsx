/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { EventEmitter } from 'node:events';

import { Loader } from './loader';
import * as posthog from './posthog';
import { LOGIN_V3_CONFIG_PATH } from '../constants';
import { getGetInfoRequest } from '../mocks/handlers/getInfoRequest';
import server, { waitForResponse } from '../mocks/server';
import { useLoginConfigStore } from '../store/login/store';
import { spyOnPosthog } from '../tests/posthog-utils';
import { controlConsoleError, setup } from '../tests/utils';
import type { AccountSettingsPrefs } from '../types/account';
import * as utils from '../utils/utils';

describe('Loader', () => {
	test('If only getComponents request fails, the LoaderFailureModal appears', async () => {
		// using getInfo and loginConfig default handlers
		server.use(
			http.get<never, never, null>('/static/iris/components.json', () =>
				HttpResponse.json(null, {
					status: 503,
					statusText: 'Controlled error: fail components.json request'
				})
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
		controlConsoleError("Cannot read properties of undefined (reading 'Fault')");
		// using getComponents and loginConfig default handlers
		server.use(
			http.post('/service/soap/GetInfoRequest', () =>
				HttpResponse.json(
					{},
					{
						status: 503,
						statusText: 'Controlled error: fail getInfo request'
					}
				)
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
		server.use(http.get(LOGIN_V3_CONFIG_PATH, () => HttpResponse.json(null, { status: 503 })));
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
		await waitFor(() => expect(useLoginConfigStore.getState().isCarbonioCE).toEqual(true));
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

	it('should enable the tracker if carbonioPrefSendAnalytics is true', async () => {
		const loginRes = waitForResponse('get', LOGIN_V3_CONFIG_PATH);
		const componentsRes = waitForResponse('get', '/static/iris/components.json');
		const getInfoRes = waitForResponse('post', '/service/soap/GetInfoRequest');
		const enableTrackerFn = jest.fn();
		const resetFn = jest.fn();
		server.use(
			http.post(
				'/service/soap/GetInfoRequest',
				getGetInfoRequest({ prefs: { _attrs: { carbonioPrefSendAnalytics: 'TRUE' } } })
			)
		);
		jest
			.spyOn(posthog, 'useTracker')
			.mockReturnValue({ enableTracker: enableTrackerFn, reset: resetFn });
		setup(
			<span data-testid={'loader'}>
				<Loader />
			</span>
		);
		await loginRes;
		await screen.findByTestId('loader');
		await componentsRes;
		await getInfoRes;
		await waitFor(() => expect(enableTrackerFn).toHaveBeenLastCalledWith(true));
	});

	it('should invoke the enableTracker function only one time', async () => {
		jest.spyOn(utils, 'getCurrentLocationHost').mockReturnValue('differentHost');
		const loginRes = waitForResponse('get', LOGIN_V3_CONFIG_PATH);
		const componentsRes = waitForResponse('get', '/static/iris/components.json');
		const getInfoRes = waitForResponse('post', '/service/soap/GetInfoRequest');
		const emitter = new EventEmitter();
		server.use(
			http.post(
				'/service/soap/GetInfoRequest',
				getGetInfoRequest({ prefs: { _attrs: { carbonioPrefSendAnalytics: 'TRUE' } } })
			),
			http.get(LOGIN_V3_CONFIG_PATH, async () => {
				await new Promise((resolve) => {
					emitter.once('emitLoginResponse', resolve);
				});
				return HttpResponse.json({});
			})
		);
		const postHog = spyOnPosthog();

		setup(
			<span data-testid={'loader'}>
				<Loader />
			</span>
		);
		await screen.findByTestId('loader');
		await componentsRes;
		await getInfoRes;
		await waitFor(() => expect(postHog.opt_in_capturing).toHaveBeenCalled());
		emitter.emit('emitLoginResponse');
		await loginRes;
		await act(async () => {
			await jest.advanceTimersToNextTimerAsync();
		});
		await waitFor(() => expect(useLoginConfigStore.getState().isCarbonioCE).toEqual(false));
		expect(postHog.opt_in_capturing).toHaveBeenCalledTimes(1);
	});

	it.each<AccountSettingsPrefs['carbonioPrefSendAnalytics']>(['FALSE', undefined])(
		'should not enable the tracker if carbonioPrefSendAnalytics is %s',
		async (carbonioPrefParam) => {
			const loginRes = waitForResponse('get', LOGIN_V3_CONFIG_PATH);
			const componentsRes = waitForResponse('get', '/static/iris/components.json');
			const getInfoRes = waitForResponse('post', '/service/soap/GetInfoRequest');
			const enableTrackerFn = jest.fn();
			const resetFn = jest.fn();
			server.use(
				http.post(
					'/service/soap/GetInfoRequest',
					getGetInfoRequest({ prefs: { _attrs: { carbonioPrefSendAnalytics: carbonioPrefParam } } })
				)
			);
			jest
				.spyOn(posthog, 'useTracker')
				.mockReturnValue({ enableTracker: enableTrackerFn, reset: resetFn });
			setup(
				<span data-testid={'loader'}>
					<Loader />
				</span>
			);
			await loginRes;
			await screen.findByTestId('loader');
			await componentsRes;
			await getInfoRes;
			await waitFor(() => expect(enableTrackerFn).toHaveBeenLastCalledWith(false));
		}
	);
});
