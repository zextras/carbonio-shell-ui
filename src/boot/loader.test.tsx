/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { EventEmitter } from 'node:events';

import * as loadApps from './app/load-apps';
import { Loader } from './loader';
import * as posthog from './posthog';
import { LOGIN_V3_CONFIG_PATH } from '../constants';
import { getGetInfoRequest } from '../mocks/handlers/getInfoRequest';
import server, { waitForResponse } from '../mocks/server';
import * as logout from '../network/logout';
import * as networkUtils from '../network/utils';
import { useLoginConfigStore } from '../store/login/store';
import { spyOnPosthog } from '../tests/posthog-utils';
import { controlConsoleError, setup, screen } from '../tests/utils';
import type { AccountSettingsPrefs } from '../types/account';
import type { ErrorSoapResponse } from '../types/network';
import * as utils from '../utils/utils';

describe('Loader', () => {
	it('should show the failure modal if only getComponents request fails with error status', async () => {
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

	it('should show the failure modal if only getComponents request fails with exception', async () => {
		controlConsoleError('Failed to fetch');
		server.use(http.get('/static/iris/components.json', () => HttpResponse.error()));

		const loginRes = waitForResponse('get', LOGIN_V3_CONFIG_PATH);
		const getInfoRes = waitForResponse('post', '/service/soap/GetInfoRequest');

		setup(
			<span data-testid={'loader'}>
				<Loader />
			</span>
		);
		await loginRes;
		await screen.findByTestId('loader');
		await getInfoRes;
		const title = await screen.findByText('Something went wrong...');
		act(() => {
			jest.runOnlyPendingTimers();
		});
		expect(title).toBeVisible();
	});

	it('should show the failure modal if only getInfo request fails with fault', async () => {
		server.use(
			http.post('/service/soap/GetInfoRequest', () =>
				HttpResponse.json<ErrorSoapResponse>(
					{
						Body: {
							Fault: {
								Code: { Value: 'Controlled error' },
								Detail: {
									Error: {
										Code: 'Controlled error',
										Trace: ''
									}
								},
								Reason: {
									Text: 'Controlled error: fail getInfo request'
								}
							}
						},
						Header: { context: {} }
					},
					{
						status: 503
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

	it('should show the failure modal if only getInfo request fails with exception', async () => {
		controlConsoleError('Failed to fetch');
		server.use(http.post('/service/soap/GetInfoRequest', () => HttpResponse.error()));
		const loginRes = waitForResponse('get', LOGIN_V3_CONFIG_PATH);
		const componentsRes = waitForResponse('get', '/static/iris/components.json');
		setup(
			<span data-testid={'loader'}>
				<Loader />
			</span>
		);
		await loginRes;
		await screen.findByTestId('loader');
		await componentsRes;

		const title = await screen.findByText('Something went wrong...');
		act(() => {
			jest.runOnlyPendingTimers();
		});
		expect(title).toBeVisible();
	});

	it('should show the failure modal if only getInfo request fails without body', async () => {
		controlConsoleError("Cannot read properties of undefined (reading 'Fault')");
		server.use(
			http.post('/service/soap/GetInfoRequest', () => HttpResponse.json({}, { status: 500 }))
		);
		const loginRes = waitForResponse('get', LOGIN_V3_CONFIG_PATH);
		const componentsRes = waitForResponse('get', '/static/iris/components.json');
		setup(
			<span data-testid={'loader'}>
				<Loader />
			</span>
		);
		await loginRes;
		await screen.findByTestId('loader');
		await componentsRes;

		const title = await screen.findByText('Something went wrong...');
		act(() => {
			jest.runOnlyPendingTimers();
		});
		expect(title).toBeVisible();
	});

	it('should not show failure modal if only loginConfig request fails', async () => {
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

	it('should not show failure modal if no request fail', async () => {
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

	it.each(['service.AUTH_REQUIRED', 'service.AUTH_EXPIRED'])(
		'should not load apps if getInfo fails with code %s',
		async (code) => {
			controlConsoleError(code);
			const loadAppsFn = jest.spyOn(loadApps, 'loadApps');
			jest.spyOn(networkUtils, 'goToLogin').mockImplementation();
			server.use(
				http.post('/service/soap/GetInfoRequest', () =>
					HttpResponse.json<ErrorSoapResponse>(
						{
							Body: {
								Fault: {
									Code: { Value: code },
									Detail: {
										Error: {
											Code: code,
											Trace: ''
										}
									},
									Reason: {
										Text: code
									}
								}
							},
							Header: { context: {} }
						},
						{
							status: 422
						}
					)
				)
			);
			setup(
				<span data-testid={'loader'}>
					<Loader />
				</span>
			);
			await screen.findByTestId('loader');
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});
			expect(loadAppsFn).not.toHaveBeenCalled();
		}
	);

	it('should enable the tracker if carbonioPrefSendAnalytics is true', async () => {
		const loginRes = waitForResponse('get', LOGIN_V3_CONFIG_PATH);
		const componentsRes = waitForResponse('get', '/static/iris/components.json');
		const getInfoRes = waitForResponse('post', '/service/soap/GetInfoRequest');
		const enableTrackerFn = jest.fn();
		server.use(
			http.post(
				'/service/soap/GetInfoRequest',
				getGetInfoRequest({ prefs: { _attrs: { carbonioPrefSendAnalytics: 'TRUE' } } })
			)
		);
		jest
			.spyOn(posthog, 'useTracker')
			.mockReturnValue({ enableTracker: enableTrackerFn, reset: jest.fn(), capture: jest.fn() });
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
			server.use(
				http.post(
					'/service/soap/GetInfoRequest',
					getGetInfoRequest({ prefs: { _attrs: { carbonioPrefSendAnalytics: carbonioPrefParam } } })
				)
			);
			jest
				.spyOn(posthog, 'useTracker')
				.mockReturnValue({ enableTracker: enableTrackerFn, reset: jest.fn(), capture: jest.fn() });
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
