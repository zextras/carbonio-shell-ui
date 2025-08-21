/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act, waitFor } from '@testing-library/react';
import type { AccountSettingsPrefs } from '@zextras/carbonio-ui-soap-lib';
import { api, ApiEvents } from '@zextras/carbonio-ui-soap-lib';
import { noop } from 'lodash';
import { http, HttpResponse } from 'msw';
import { EventEmitter } from 'node:events';

import SpyInstance = jest.SpyInstance;
import type * as loadAppsModule from './app/load-apps';
import { Loader } from './loader';
import { LOGIN_V3_CONFIG_PATH } from '../constants';
import server from '../mocks/server';
import * as logout from '../network/logout';
import * as networkUtils from '../network/utils';
import { useLoginConfigStore } from '../store/login/store';
import { LOGGED_USER, TIMERS } from '../tests/constants';
import { spyOnPosthog } from '../tests/posthog-utils';
import { setup, screen } from '../tests/utils';
import * as tracker from '../tracker/tracker';
import * as utils from '../utils/utils';

jest.mock<typeof loadAppsModule>('./app/load-apps');

const getGetInfoResult = (
	customInfo?: Partial<Awaited<ReturnType<typeof api.getInfo>>>
): Awaited<ReturnType<typeof api.getInfo>> => ({
	id: LOGGED_USER.id,
	name: LOGGED_USER.name,
	version: '',
	identities: LOGGED_USER.identities,
	signatures: { signature: [] },
	rights: { targets: [] },
	zimlets: { zimlet: [] },
	lifetime: 86400000,
	...customInfo,
	prefs: { _attrs: { ...LOGGED_USER.prefs, ...customInfo?.prefs?._attrs } },
	attrs: { _attrs: { ...LOGGED_USER.attrs, ...customInfo?.attrs?._attrs } },
	props: {
		prop: { ...LOGGED_USER.props, ...customInfo?.props?.prop }
	}
});

const mockGetInfo = (
	customInfo?: Partial<Awaited<ReturnType<typeof api.getInfo>>>
): SpyInstance<ReturnType<typeof api.getInfo>> =>
	jest.spyOn(api, 'getInfo').mockReturnValue(Promise.resolve(getGetInfoResult(customInfo)));

describe('Loader', () => {
	test('If only getComponents request fails, the LoaderFailureModal appears', async () => {
		// using loginConfig default handlers
		mockGetInfo();
		server.use(
			http.get<never, never, null>('/static/iris/components.json', () =>
				HttpResponse.json(null, {
					status: 503,
					statusText: 'Controlled error: fail components.json request'
				})
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
		const title = await screen.findByText('Something went wrong...');
		act(() => {
			jest.advanceTimersByTime(TIMERS.modalShow);
		});
		expect(title).toBeVisible();
	});

	test('If only getInfo request fails, the LoaderFailureModal appears', async () => {
		jest.spyOn(api, 'getInfo').mockRejectedValue({
			status: 503,
			statusText: 'Controlled error: fail getInfo request'
		});
		setup(
			<span data-testid={'loader'}>
				<Loader />
			</span>
		);
		await screen.findByTestId('loader');
		await act(async () => {
			await jest.advanceTimersToNextTimerAsync();
		});
		const title = await screen.findByText('Something went wrong...');
		act(() => {
			jest.advanceTimersByTime(TIMERS.modalShow);
		});
		expect(title).toBeVisible();
	});

	test('If only loginConfig request fails, the LoaderFailureModal does not appear', async () => {
		mockGetInfo();
		server.use(http.get(LOGIN_V3_CONFIG_PATH, () => HttpResponse.json(null, { status: 503 })));
		setup(
			<span data-testid={'loader'}>
				<Loader />
			</span>
		);
		await screen.findByTestId('loader');
		await act(async () => {
			await jest.advanceTimersToNextTimerAsync();
		});
		await waitFor(() => expect(useLoginConfigStore.getState().isCarbonioCE).toEqual(true));
		expect(screen.queryByText('Something went wrong...')).not.toBeInTheDocument();
	});

	test('If Loader requests do not fail, the LoaderFailureModal does not appear', async () => {
		mockGetInfo();
		setup(
			<span data-testid={'loader'}>
				<Loader />
			</span>
		);
		await screen.findByTestId('loader');
		await act(async () => {
			await jest.advanceTimersToNextTimerAsync();
		});
		expect(screen.queryByText('Something went wrong...')).not.toBeInTheDocument();
	});

	test('should enable the tracker if carbonioPrefSendAnalytics is true', async () => {
		const enableTrackerFn = jest.fn();
		mockGetInfo({ prefs: { _attrs: { carbonioPrefSendAnalytics: 'TRUE' } } });

		jest
			.spyOn(tracker, 'useTracker')
			.mockReturnValue({ enableTracker: enableTrackerFn, reset: jest.fn(), capture: jest.fn() });
		setup(
			<span data-testid={'loader'}>
				<Loader />
			</span>
		);
		await screen.findByTestId('loader');
		await act(async () => {
			await jest.advanceTimersToNextTimerAsync();
		});
		await waitFor(() => expect(enableTrackerFn).toHaveBeenLastCalledWith(true));
	});

	test('should invoke the enableTracker function only one time', async () => {
		jest.spyOn(utils, 'getCurrentLocationHost').mockReturnValue('differentHost');
		const emitter = new EventEmitter();
		mockGetInfo({ prefs: { _attrs: { carbonioPrefSendAnalytics: 'TRUE' } } });
		server.use(
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
		await act(async () => {
			await jest.advanceTimersToNextTimerAsync();
		});
		await waitFor(() => expect(postHog.opt_in_capturing).toHaveBeenCalled());
		emitter.emit('emitLoginResponse');
		await act(async () => {
			await jest.advanceTimersToNextTimerAsync();
		});
		await waitFor(() => expect(useLoginConfigStore.getState().isCarbonioCE).toEqual(false));
		expect(postHog.opt_in_capturing).toHaveBeenCalledTimes(1);
	});

	test.each<AccountSettingsPrefs['carbonioPrefSendAnalytics']>(['FALSE', undefined])(
		'should not enable the tracker if carbonioPrefSendAnalytics is %s',
		async (carbonioPrefParam) => {
			mockGetInfo({ prefs: { _attrs: { carbonioPrefSendAnalytics: carbonioPrefParam } } });
			const enableTrackerFn = jest.fn();
			jest
				.spyOn(tracker, 'useTracker')
				.mockReturnValue({ enableTracker: enableTrackerFn, reset: jest.fn(), capture: jest.fn() });
			setup(
				<span data-testid={'loader'}>
					<Loader />
				</span>
			);
			await screen.findByTestId('loader');
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});
			await waitFor(() => expect(enableTrackerFn).toHaveBeenLastCalledWith(false));
		}
	);

	describe('Session expiration', () => {
		test('should redirect to login if user session is expired', async () => {
			const goToLoginFn = jest.spyOn(networkUtils, 'goToLogin').mockImplementation(noop);
			mockGetInfo();

			setup(<Loader />);
			window.dispatchEvent(new CustomEvent(ApiEvents.AuthError));

			await waitFor(() => expect(goToLoginFn).toHaveBeenCalled());
		});

		test('should show a temporary snackbar when the session expires in 10 minutes', async () => {
			const tenMinutes = 10 * 60 * 1000;
			const tenSeconds = 10 * 1000;
			mockGetInfo({ lifetime: tenMinutes + 2 });
			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});
			expect(
				screen.queryByText(
					"Your session will expire in 10 minutes. After that, you'll be redirected to the login page."
				)
			).not.toBeInTheDocument();
			await act(async () => {
				await jest.advanceTimersByTimeAsync(2);
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

		test('should show the go to login page action on the 10 minutes snackbar. Action calls logout', async () => {
			const logoutFn = jest.spyOn(logout, 'logout').mockImplementation();
			const tenMinutes = 10 * 60 * 1000;
			mockGetInfo({ lifetime: tenMinutes });
			const { user } = setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});
			const goToLoginPageButton = await screen.findByRole('button', { name: /go to login page/i });
			expect(goToLoginPageButton).toBeVisible();
			await user.click(goToLoginPageButton);
			expect(logoutFn).toHaveBeenCalled();
		});

		test('should show a permanent snackbar when the session expires in 3 minutes', async () => {
			const threeMinutes = 3 * 60 * 1000;
			const tenSeconds = 10 * 1000;
			mockGetInfo({ lifetime: threeMinutes + 2 });
			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});
			expect(
				screen.queryByText(
					"Your session will expire in 3 minutes. After that, you'll be redirected to the login page."
				)
			).not.toBeInTheDocument();
			await act(async () => {
				await jest.advanceTimersByTimeAsync(2);
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

		test('should show the go to login page action on the 3 minutes snackbar. Action calls logout', async () => {
			const logoutFn = jest.spyOn(logout, 'logout').mockImplementation();
			const threeMinutes = 3 * 60 * 1000;
			mockGetInfo({ lifetime: threeMinutes });
			const { user } = setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});
			const goToLoginPageButton = await screen.findByRole('button', { name: /go to login page/i });
			expect(goToLoginPageButton).toBeVisible();
			await user.click(goToLoginPageButton);
			expect(logoutFn).toHaveBeenCalled();
		});

		test('should show a temporary snackbar when the session expires in 60 seconds', async () => {
			jest.spyOn(logout, 'logout').mockImplementation();
			const oneMinute = 60 * 1000;
			mockGetInfo({ lifetime: oneMinute + 2 });
			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});
			expect(
				screen.queryByText(
					"Your session will expire in 60 seconds. After that, you'll be redirected to the login page."
				)
			).not.toBeInTheDocument();
			await act(async () => {
				await jest.advanceTimersByTimeAsync(2);
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

		test('should decrease the counter label inside the 60 seconds snackbar', async () => {
			jest.spyOn(logout, 'logout').mockImplementation();
			const oneMinute = 60 * 1000;
			mockGetInfo({ lifetime: oneMinute + 2 });
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

		test('should start the counter of the 60 seconds snackbar from the real remaining seconds', async () => {
			jest.spyOn(logout, 'logout').mockImplementation();
			mockGetInfo({ lifetime: 30 * 1000 });
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

		test('should show the go to login page action on the 60 seconds snackbar. Action calls logout', async () => {
			const logoutFn = jest.spyOn(logout, 'logout').mockImplementation();
			const oneMinute = 60 * 1000;
			mockGetInfo({ lifetime: oneMinute });
			const { user } = setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});
			const goToLoginPageButton = await screen.findByRole('button', { name: /go to login page/i });
			expect(goToLoginPageButton).toBeVisible();
			await user.click(goToLoginPageButton);
			expect(logoutFn).toHaveBeenCalled();
		});

		test('should not show 10 minutes snackbar if session expires in less than 10 minutes', async () => {
			const tenMinutes = 10 * 60 * 1000;
			mockGetInfo({ lifetime: tenMinutes - 1 });
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

		test('should not show the 3 minutes snackbar if the session expires in less than 3 minutes', async () => {
			const threeMinutes = 3 * 60 * 1000;
			mockGetInfo({ lifetime: threeMinutes - 1 });
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

		test('should show the 60 seconds snackbar if the session expires in less than 60 seconds', async () => {
			const oneMinute = 60 * 1000;
			mockGetInfo({ lifetime: oneMinute - 10000 });
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

		test.each([60, 30])(
			'should call logout when 60 seconds snackbar timeout expires (session lifetime is %s seconds)',
			async (expirationSeconds) => {
				const logoutFn = jest.spyOn(logout, 'logout').mockImplementation();
				const expiration = expirationSeconds * 1000;
				mockGetInfo({ lifetime: expiration });
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

		test('should show 60 seconds snackbar and hide the 3 minutes snackbar', async () => {
			const threeMinutes = 3 * 60 * 1000;
			mockGetInfo({ lifetime: threeMinutes });
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

		test('should add visibility change event listener', async () => {
			const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
			const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

			mockGetInfo({ lifetime: 10 * 60 * 1000 });
			const { unmount } = setup(<Loader />);

			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});

			// Should have added the visibility change listener
			expect(addEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

			unmount();

			// Should have removed the visibility change listener on cleanup
			expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

			addEventListenerSpy.mockRestore();
			removeEventListenerSpy.mockRestore();
		});
	});

	describe('Idle timeout modal', () => {
		test('should show idle timeout modal when zimbraMailIdleSessionTimeout is set and warning time is reached', async () => {
			mockGetInfo({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '120s' } }
			});

			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});

			// Advance to exactly the warning time (60 seconds before timeout = 60s)
			await act(async () => {
				await jest.advanceTimersByTimeAsync(60 * 1000);
			});

			// Wait for the modal to appear
			await waitFor(() => {
				expect(screen.getByText('Inactivity warning')).toBeVisible();
			});

			expect(
				screen.getByText(
					`You've been inactive for a while. You'll be logged out soon for security reasons. Press any key or click anywhere to stay logged in.`
				)
			).toBeVisible();
		});

		test('should show "Stay logged in" and "Logout" buttons in idle timeout modal', async () => {
			mockGetInfo({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '120s' } }
			});

			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});

			await act(async () => {
				await jest.advanceTimersByTimeAsync(60 * 1000);
			});

			// Wait for the modal to appear
			await waitFor(() => {
				expect(screen.getByText('Inactivity warning')).toBeVisible();
			});

			expect(await screen.findByRole('button', { name: /stay logged in/i })).toBeVisible();
			expect(screen.getByRole('button', { name: /logout/i })).toBeVisible();
		});

		test('should reset idle timeout when clicking "Stay logged in" button', async () => {
			const logoutFn = jest.spyOn(logout, 'logout').mockImplementation();
			mockGetInfo({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '120s' } }
			});

			const { user } = setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});

			// Show warning modal
			await act(async () => {
				await jest.advanceTimersByTimeAsync(60 * 1000);
			});

			const stayLoggedInButton = await screen.findByRole('button', { name: /stay logged in/i });
			await user.click(stayLoggedInButton);

			// Modal should disappear
			expect(screen.queryByText('Inactivity warning')).not.toBeInTheDocument();

			// Should not logout after original timeout time
			await act(async () => {
				await jest.advanceTimersByTimeAsync(60 * 1000);
			});

			expect(logoutFn).not.toHaveBeenCalled();
		});

		test('should call logout when clicking "Logout" button in idle timeout modal', async () => {
			const logoutFn = jest.spyOn(logout, 'logout').mockImplementation();
			mockGetInfo({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '120s' } }
			});

			const { user } = setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});

			await act(async () => {
				await jest.advanceTimersByTimeAsync(60 * 1000);
			});

			const logoutButton = await screen.findByRole('button', { name: /logout/i });
			await user.click(logoutButton);

			expect(logoutFn).toHaveBeenCalled();
		});

		test('should automatically logout when idle timeout expires without user interaction', async () => {
			const logoutFn = jest.spyOn(logout, 'logout').mockImplementation();
			mockGetInfo({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '120s' } }
			});

			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});

			// Let the full timeout expire
			await act(async () => {
				await jest.advanceTimersByTimeAsync(120 * 1000);
			});

			expect(logoutFn).toHaveBeenCalled();
		});

		test('should not show idle timeout modal when zimbraMailIdleSessionTimeout is not set', async () => {
			mockGetInfo(); // No zimbraMailIdleSessionTimeout

			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});

			// Advance time significantly
			await act(async () => {
				await jest.advanceTimersByTimeAsync(300 * 1000);
			});

			expect(screen.queryByText('Inactivity warning')).not.toBeInTheDocument();
		});

		test('should not show idle timeout modal when zimbraMailIdleSessionTimeout is 0', async () => {
			mockGetInfo({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '0s' } }
			});

			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});

			await act(async () => {
				await jest.advanceTimersByTimeAsync(300 * 1000);
			});

			expect(screen.queryByText('Inactivity warning')).not.toBeInTheDocument();
		});

		test('should show idle timeout modal immediately if timeout is less than warning time', async () => {
			mockGetInfo({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '30s' } }
			});

			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});

			// Wait for the modal to appear
			// Modal should appear immediately since 30s < 60s warning time
			await waitFor(() => {
				expect(screen.getByText('Inactivity warning')).toBeVisible();
			});
		});

		test('should reset idle timeout on user activity and hide modal', async () => {
			const logoutFn = jest.spyOn(logout, 'logout').mockImplementation();
			mockGetInfo({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '120s' } }
			});

			setup(<Loader />);
			await act(async () => {
				await jest.advanceTimersToNextTimerAsync();
			});

			// Show warning modal
			await act(async () => {
				await jest.advanceTimersByTimeAsync(60 * 1000);
			});

			await waitFor(() => {
				expect(screen.getByText('Inactivity warning')).toBeVisible();
			});

			// Simulate user activity (mouse click)
			act(() => {
				document.dispatchEvent(new Event('keydown'));
			});

			// Modal should disappear
			await waitFor(() => {
				expect(screen.queryByText('Inactivity warning')).not.toBeInTheDocument();
			});

			// Should not logout after original timeout time
			await act(async () => {
				await jest.advanceTimersByTimeAsync(60 * 1000);
			});

			expect(logoutFn).not.toHaveBeenCalled();
		});
	});
});
