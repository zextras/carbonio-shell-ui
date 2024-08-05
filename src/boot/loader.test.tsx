/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { EventEmitter } from 'node:events';

import { Loader } from './loader';
import * as posthog from './posthog';
import { LOGIN_V3_CONFIG_PATH } from '../constants';
import { getGetInfoRequest } from '../mocks/handlers/getInfoRequest';
import server, { waitForResponse } from '../mocks/server';
import * as logout from '../network/logout';
import { useLoginConfigStore } from '../store/login/store';
import { spyOnPosthog } from '../tests/posthog-utils';
import { controlConsoleError, setup, screen } from '../tests/utils';
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

	describe('Session expiration', () => {
		it('should show a temporary snackbar when the session expires in 10 minutes', async () => {
			const tenMinutes = 10 * 60 * 1000;
			const tenSeconds = 10 * 1000;
			server.use(
				http.post('/service/soap/GetInfoRequest', getGetInfoRequest({ lifetime: tenMinutes + 2 }))
			);
			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersByTimeAsync(1);
			});
			expect(
				screen.queryByText(
					"Your session will expire in 10 minutes. After that, you'll be redirected to the login page."
				)
			).not.toBeInTheDocument();
			await act(async () => {
				await jest.advanceTimersByTimeAsync(1);
			});
			const snackbar = screen.getByText(
				"Your session will expire in 10 minutes. After that, you'll be redirected to the login page."
			);
			expect(snackbar).toBeVisible();
			await act(async () => {
				await jest.advanceTimersByTimeAsync(tenSeconds);
			});
			expect(snackbar).not.toBeInTheDocument();
		});

		it('should show the go to login page action on the 10 minutes snackbar. Action calls logout', async () => {
			const logoutFn = jest.spyOn(logout, 'logout').mockImplementation();
			const tenMinutes = 10 * 60 * 1000;
			server.use(
				http.post('/service/soap/GetInfoRequest', getGetInfoRequest({ lifetime: tenMinutes }))
			);
			const { user } = setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});
			const goToLoginPageButton = await screen.findByRole('button', { name: /go to login page/i });
			expect(goToLoginPageButton).toBeVisible();
			await user.click(goToLoginPageButton);
			expect(logoutFn).toHaveBeenCalled();
		});

		it('should show a permanent snackbar when the session expires in 3 minutes', async () => {
			const threeMinutes = 3 * 60 * 1000;
			const tenSeconds = 10 * 1000;
			server.use(
				http.post('/service/soap/GetInfoRequest', getGetInfoRequest({ lifetime: threeMinutes + 2 }))
			);
			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersByTimeAsync(1);
			});
			expect(
				screen.queryByText(
					"Your session will expire in 3 minutes. After that, you'll be redirected to the login page."
				)
			).not.toBeInTheDocument();
			await act(async () => {
				await jest.advanceTimersByTimeAsync(1);
			});
			const snackbar = await screen.findByText(
				"Your session will expire in 3 minutes. After that, you'll be redirected to the login page."
			);
			expect(snackbar).toBeVisible();
			await act(async () => {
				await jest.advanceTimersByTimeAsync(tenSeconds);
			});
			expect(snackbar).toBeVisible();
		});

		it('should show the go to login page action on the 3 minutes snackbar. Action calls logout', async () => {
			const logoutFn = jest.spyOn(logout, 'logout').mockImplementation();
			const threeMinutes = 3 * 60 * 1000;
			server.use(
				http.post('/service/soap/GetInfoRequest', getGetInfoRequest({ lifetime: threeMinutes }))
			);
			const { user } = setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});
			const goToLoginPageButton = await screen.findByRole('button', { name: /go to login page/i });
			expect(goToLoginPageButton).toBeVisible();
			await user.click(goToLoginPageButton);
			expect(logoutFn).toHaveBeenCalled();
		});

		it('should show a temporary snackbar when the session expires in 60 seconds', async () => {
			jest.spyOn(logout, 'logout').mockImplementation();
			const oneMinute = 60 * 1000;
			server.use(
				http.post('/service/soap/GetInfoRequest', getGetInfoRequest({ lifetime: oneMinute + 2 }))
			);
			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersByTimeAsync(1);
			});
			expect(
				screen.queryByText(
					"Your session will expire in 60 seconds. After that, you'll be redirected to the login page."
				)
			).not.toBeInTheDocument();
			await act(async () => {
				await jest.advanceTimersByTimeAsync(1);
			});
			const snackbar = await screen.findByText(
				"Your session will expire in 60 seconds. After that, you'll be redirected to the login page."
			);
			expect(snackbar).toBeVisible();
			await act(async () => {
				await jest.advanceTimersByTimeAsync(oneMinute);
			});
			expect(snackbar).not.toBeInTheDocument();
		});

		it('should decrease the counter label inside the 60 seconds snackbar', async () => {
			jest.spyOn(logout, 'logout').mockImplementation();
			const oneMinute = 60 * 1000;
			server.use(
				http.post('/service/soap/GetInfoRequest', getGetInfoRequest({ lifetime: oneMinute + 2 }))
			);
			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersByTimeAsync(2);
			});
			await screen.findByText(
				"Your session will expire in 60 seconds. After that, you'll be redirected to the login page."
			);
			await act(async () => {
				await jest.advanceTimersByTimeAsync(1000);
			});
			expect(
				screen.getByText(
					"Your session will expire in 59 seconds. After that, you'll be redirected to the login page."
				)
			).toBeVisible();
			await act(async () => {
				await jest.advanceTimersByTimeAsync(1000);
			});
			expect(
				screen.getByText(
					"Your session will expire in 58 seconds. After that, you'll be redirected to the login page."
				)
			).toBeVisible();
			await act(async () => {
				await jest.advanceTimersByTimeAsync(30000);
			});
			expect(
				screen.getByText(
					"Your session will expire in 28 seconds. After that, you'll be redirected to the login page."
				)
			).toBeVisible();
		});

		it('should start the counter of the 60 seconds snackbar from the real remaining seconds', async () => {
			jest.spyOn(logout, 'logout').mockImplementation();
			server.use(
				http.post('/service/soap/GetInfoRequest', getGetInfoRequest({ lifetime: 30 * 1000 }))
			);
			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersByTimeAsync(1);
			});
			expect(
				await screen.findByText(
					"Your session will expire in 30 seconds. After that, you'll be redirected to the login page."
				)
			).toBeVisible();
		});

		it('should show the go to login page action on the 60 seconds snackbar. Action calls logout', async () => {
			const logoutFn = jest.spyOn(logout, 'logout').mockImplementation();
			const oneMinute = 60 * 1000;
			server.use(
				http.post('/service/soap/GetInfoRequest', getGetInfoRequest({ lifetime: oneMinute }))
			);
			const { user } = setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});
			const goToLoginPageButton = await screen.findByRole('button', { name: /go to login page/i });
			expect(goToLoginPageButton).toBeVisible();
			await user.click(goToLoginPageButton);
			expect(logoutFn).toHaveBeenCalled();
		});

		it('should not show 10 minutes snackbar if session expires in less than 10 minutes', async () => {
			const tenMinutes = 10 * 60 * 1000;
			server.use(
				http.post('/service/soap/GetInfoRequest', getGetInfoRequest({ lifetime: tenMinutes - 1 }))
			);
			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});
			expect(
				screen.queryByText(
					"Your session will expire in 10 minutes. After that, you'll be redirected to the login page."
				)
			).not.toBeInTheDocument();
		});

		it('should not show the 3 minutes snackbar if the session expires in less than 3 minutes', async () => {
			const threeMinutes = 3 * 60 * 1000;
			server.use(
				http.post('/service/soap/GetInfoRequest', getGetInfoRequest({ lifetime: threeMinutes - 1 }))
			);
			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});
			expect(
				screen.queryByText(
					"Your session will expire in 3 minutes. After that, you'll be redirected to the login page."
				)
			).not.toBeInTheDocument();
		});

		it('should show the 60 seconds snackbar if the session expires in less than 60 seconds', async () => {
			const oneMinute = 60 * 1000;
			server.use(
				http.post(
					'/service/soap/GetInfoRequest',
					getGetInfoRequest({ lifetime: oneMinute - 10000 })
				)
			);
			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});
			expect(
				await screen.findByText(
					/Your session will expire in \d+ seconds\. After that, you'll be redirected to the login page\./
				)
			).toBeVisible();
		});

		it.each([60, 30])(
			'should call logout when 60 seconds snackbar timeout expires (session lifetime is %s seconds)',
			async (expirationSeconds) => {
				const logoutFn = jest.spyOn(logout, 'logout').mockImplementation();
				const expiration = expirationSeconds * 1000;
				server.use(
					http.post('/service/soap/GetInfoRequest', getGetInfoRequest({ lifetime: expiration }))
				);
				setup(<Loader />);
				await act(async () => {
					await jest.advanceTimersToNextTimerAsync();
				});
				await screen.findByText(
					/Your session will expire in \d+ seconds\. After that, you'll be redirected to the login page\./i
				);
				await act(async () => {
					await jest.advanceTimersByTimeAsync(expiration);
				});
				expect(logoutFn).toHaveBeenCalled();
			}
		);

		it('should show 60 seconds snackbar and hide the 3 minutes snackbar', async () => {
			const threeMinutes = 3 * 60 * 1000;
			server.use(
				http.post('/service/soap/GetInfoRequest', getGetInfoRequest({ lifetime: threeMinutes }))
			);
			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});
			await screen.findByText(
				"Your session will expire in 3 minutes. After that, you'll be redirected to the login page."
			);
			await act(async () => {
				await jest.advanceTimersByTimeAsync(2 * 60 * 1000);
			});
			expect(
				await screen.findByText(
					"Your session will expire in 60 seconds. After that, you'll be redirected to the login page."
				)
			).toBeVisible();
			expect(
				screen.queryByText(
					"Your session will expire in 3 minutes. After that, you'll be redirected to the login page."
				)
			).not.toBeInTheDocument();
		});
	});
});
