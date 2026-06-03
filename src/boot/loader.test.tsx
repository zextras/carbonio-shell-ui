/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { act, waitFor } from '@testing-library/react';
import { api, ApiEvents } from '@zextras/carbonio-ui-soap-lib';
import { noop } from 'lodash';
import { http, HttpResponse } from 'msw';
import type { MockInstance } from 'vitest';

import { Loader } from './loader';
import { LOGIN_V3_CONFIG_PATH } from '../constants';
import server from '../mocks/server';
import * as logout from '../network/logout';
import * as networkUtils from '../network/utils';
import { useLoginConfigStore } from '../store/login/store';
import { LOGGED_USER, TIMERS } from '../tests/constants';
import { setup, screen } from '../tests/utils';
import type { AccountSettingsAttrs } from '../types/account';

vi.mock('./app/load-apps');

type GetInfoResponseShape = Awaited<ReturnType<typeof api.getInfo>>;

type GetInfoResponseOverride = Omit<Partial<GetInfoResponseShape>, 'attrs'> & {
	attrs?: { _attrs?: Partial<AccountSettingsAttrs> };
};

const getGetInfoResult = (customInfo?: GetInfoResponseOverride): GetInfoResponseShape => ({
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
	attrs: {
		_attrs: {
			...LOGGED_USER.attrs,
			...customInfo?.attrs?._attrs
		} as GetInfoResponseShape['attrs']['_attrs']
	},
	props: {
		prop: { ...LOGGED_USER.props, ...customInfo?.props?.prop }
	}
});

const mockGetInfo = (customInfo?: GetInfoResponseOverride): MockInstance<typeof api.getInfo> =>
	vi.spyOn(api, 'getInfo').mockReturnValue(Promise.resolve(getGetInfoResult(customInfo)));

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
			await vi.advanceTimersToNextTimerAsync();
		});
		const title = await screen.findByText('Something went wrong...');
		act(() => {
			vi.advanceTimersByTime(TIMERS.modalShow);
		});
		expect(
			title,
			'the failure modal should be visible when the getComponents request fails'
		).toBeVisible();
	});

	test('If only getInfo request fails, the LoaderFailureModal appears', async () => {
		vi.spyOn(api, 'getInfo').mockRejectedValue({
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
			await vi.advanceTimersToNextTimerAsync();
		});
		const title = await screen.findByText('Something went wrong...');
		act(() => {
			vi.advanceTimersByTime(TIMERS.modalShow);
		});
		expect(
			title,
			'the failure modal should be visible when the getInfo request fails'
		).toBeVisible();
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
			await vi.advanceTimersToNextTimerAsync();
		});
		await waitFor(() =>
			expect(
				useLoginConfigStore.getState().isCarbonioCE,
				'the login config store should fall back to the Carbonio CE default when the loginConfig request fails'
			).toEqual(true)
		);
		expect(
			screen.queryByText('Something went wrong...'),
			'the failure modal should not appear when only the loginConfig request fails'
		).not.toBeInTheDocument();
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
			await vi.advanceTimersToNextTimerAsync();
		});
		expect(
			screen.queryByText('Something went wrong...'),
			'the failure modal should not appear when none of the Loader requests fail'
		).not.toBeInTheDocument();
	});

	describe('Session expiration', () => {
		test('should redirect to login if user session is expired', async () => {
			const goToLoginFn = vi.spyOn(networkUtils, 'goToLogin').mockImplementation(noop);
			mockGetInfo();

			setup(<Loader />);
			window.dispatchEvent(new CustomEvent(ApiEvents.AuthError));

			await waitFor(() =>
				expect(
					goToLoginFn,
					'should redirect to login when an auth error event is dispatched for an expired session'
				).toHaveBeenCalled()
			);
		});

		test('should show a temporary snackbar when the session expires in 10 minutes', async () => {
			const tenMinutes = 10 * 60 * 1000;
			const tenSeconds = 10 * 1000;
			mockGetInfo({ lifetime: tenMinutes + 100 });
			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});
			expect(
				screen.queryByText(
					"Your session will expire in 10 minutes. After that, you'll be redirected to the login page."
				),
				'the 10 minutes snackbar should not be shown before the 10 minutes threshold is reached'
			).not.toBeInTheDocument();
			await act(async () => {
				await vi.advanceTimersByTimeAsync(100);
			});
			const snackbar = screen.getByText(
				"Your session will expire in 10 minutes. After that, you'll be redirected to the login page."
			);
			expect(
				snackbar,
				'the 10 minutes snackbar should be visible once the threshold is reached'
			).toBeVisible();
			await act(async () => {
				await vi.advanceTimersByTimeAsync(tenSeconds);
			});
			expect(
				snackbar,
				'the 10 minutes snackbar should disappear automatically after a short time'
			).not.toBeInTheDocument();
		});

		test('should show the go to login page action on the 10 minutes snackbar. Action calls logout', async () => {
			const logoutFn = vi.spyOn(logout, 'logout').mockImplementation(async () => {});
			const tenMinutes = 10 * 60 * 1000;
			mockGetInfo({ lifetime: tenMinutes + 100 });
			const { user } = setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});
			const goToLoginPageButton = await screen.findByRole('button', { name: /go to login page/i });
			await user.click(goToLoginPageButton);
			expect(
				logoutFn,
				'clicking the action on the 10 minutes snackbar should call logout'
			).toHaveBeenCalled();
		});

		test('should show a permanent snackbar when the session expires in 3 minutes', async () => {
			const threeMinutes = 3 * 60 * 1000;
			const tenSeconds = 10 * 1000;
			mockGetInfo({ lifetime: threeMinutes + 100 });
			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});
			expect(
				screen.queryByText(
					"Your session will expire in 3 minutes. After that, you'll be redirected to the login page."
				),
				'the 3 minutes snackbar should not be shown before the 3 minutes threshold is reached'
			).not.toBeInTheDocument();
			await act(async () => {
				await vi.advanceTimersByTimeAsync(100);
			});
			const snackbar = await screen.findByText(
				"Your session will expire in 3 minutes. After that, you'll be redirected to the login page."
			);
			expect(
				snackbar,
				'the 3 minutes snackbar should be visible once the threshold is reached'
			).toBeVisible();
			await act(async () => {
				await vi.advanceTimersByTimeAsync(tenSeconds);
			});
			expect(
				snackbar,
				'the 3 minutes snackbar should be permanent and remain visible over time'
			).toBeVisible();
		});

		test('should show the go to login page action on the 3 minutes snackbar. Action calls logout', async () => {
			const logoutFn = vi.spyOn(logout, 'logout').mockImplementation(async () => {});
			const threeMinutes = 3 * 60 * 1000;
			mockGetInfo({ lifetime: threeMinutes + 100 });
			const { user } = setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});
			const goToLoginPageButton = await screen.findByRole('button', { name: /go to login page/i });
			await user.click(goToLoginPageButton);
			expect(
				logoutFn,
				'clicking the action on the 3 minutes snackbar should call logout'
			).toHaveBeenCalled();
		});

		test('should show a temporary snackbar when the session expires in 60 seconds', async () => {
			vi.spyOn(logout, 'logout').mockImplementation(async () => {});
			const oneMinute = 60 * 1000;
			mockGetInfo({ lifetime: oneMinute + 100 });
			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});
			expect(
				screen.queryByText(
					"Your session will expire in 60 seconds. After that, you'll be redirected to the login page."
				),
				'the 60 seconds snackbar should not be shown before the 60 seconds threshold is reached'
			).not.toBeInTheDocument();
			await act(async () => {
				await vi.advanceTimersByTimeAsync(100);
			});
			const snackbar = await screen.findByText(
				"Your session will expire in 60 seconds. After that, you'll be redirected to the login page."
			);
			expect(
				snackbar,
				'the 60 seconds snackbar should be visible once the threshold is reached'
			).toBeVisible();
			await act(async () => {
				await vi.advanceTimersByTimeAsync(oneMinute);
			});
			expect(
				snackbar,
				'the 60 seconds snackbar should disappear after the session has fully expired'
			).not.toBeInTheDocument();
		});

		test('should decrease the counter label inside the 60 seconds snackbar', async () => {
			vi.spyOn(logout, 'logout').mockImplementation(async () => {});
			const oneMinute = 60 * 1000;
			mockGetInfo({ lifetime: oneMinute + 100 });
			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersByTimeAsync(100);
			});
			await screen.findByText(
				"Your session will expire in 60 seconds. After that, you'll be redirected to the login page."
			);
			await act(async () => {
				await vi.advanceTimersByTimeAsync(1000);
			});
			expect(
				screen.getByText(
					"Your session will expire in 59 seconds. After that, you'll be redirected to the login page."
				),
				'the 60 seconds snackbar counter should decrease to 59 seconds after one second'
			).toBeVisible();
			await act(async () => {
				await vi.advanceTimersByTimeAsync(1000);
			});
			expect(
				screen.getByText(
					"Your session will expire in 58 seconds. After that, you'll be redirected to the login page."
				),
				'the 60 seconds snackbar counter should decrease to 58 seconds after two seconds'
			).toBeVisible();
			await act(async () => {
				await vi.advanceTimersByTimeAsync(30000);
			});
			expect(
				screen.getByText(
					"Your session will expire in 28 seconds. After that, you'll be redirected to the login page."
				),
				'the 60 seconds snackbar counter should decrease to 28 seconds after a further 30 seconds'
			).toBeVisible();
		});

		test('should start the counter of the 60 seconds snackbar from the real remaining seconds', async () => {
			vi.spyOn(logout, 'logout').mockImplementation(async () => {});
			mockGetInfo({ lifetime: 30 * 1000 });
			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersByTimeAsync(1);
			});
			expect(
				await screen.findByText(
					"Your session will expire in 30 seconds. After that, you'll be redirected to the login page."
				),
				'the 60 seconds snackbar counter should start from the real remaining 30 seconds'
			).toBeVisible();
		});

		test('should show the go to login page action on the 60 seconds snackbar. Action calls logout', async () => {
			const logoutFn = vi.spyOn(logout, 'logout').mockImplementation(async () => {});
			const oneMinute = 60 * 1000;
			mockGetInfo({ lifetime: oneMinute + 100 });
			const { user } = setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});
			const goToLoginPageButton = await screen.findByRole('button', { name: /go to login page/i });
			await user.click(goToLoginPageButton);
			expect(
				logoutFn,
				'clicking the action on the 60 seconds snackbar should call logout'
			).toHaveBeenCalled();
		});

		test('should not show 10 minutes snackbar if session expires in less than 10 minutes', async () => {
			const tenMinutes = 10 * 60 * 1000;
			mockGetInfo({ lifetime: tenMinutes - 1 });
			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});
			expect(
				screen.queryByText(
					"Your session will expire in 10 minutes. After that, you'll be redirected to the login page."
				),
				'the 10 minutes snackbar should not be shown when the session expires in less than 10 minutes'
			).not.toBeInTheDocument();
		});

		test('should not show the 3 minutes snackbar if the session expires in less than 3 minutes', async () => {
			const threeMinutes = 3 * 60 * 1000;
			mockGetInfo({ lifetime: threeMinutes - 1 });
			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});
			expect(
				screen.queryByText(
					"Your session will expire in 3 minutes. After that, you'll be redirected to the login page."
				),
				'the 3 minutes snackbar should not be shown when the session expires in less than 3 minutes'
			).not.toBeInTheDocument();
		});

		test('should show the 60 seconds snackbar if the session expires in less than 60 seconds', async () => {
			const oneMinute = 60 * 1000;
			mockGetInfo({ lifetime: oneMinute - 10000 });
			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});
			expect(
				await screen.findByText(
					/Your session will expire in \d+ seconds\. After that, you'll be redirected to the login page\./
				),
				'the 60 seconds snackbar should be shown when the session expires in less than 60 seconds'
			).toBeVisible();
		});

		test.each([60, 30])(
			'should call logout when 60 seconds snackbar timeout expires (session lifetime is %s seconds)',
			async (expirationSeconds) => {
				const logoutFn = vi.spyOn(logout, 'logout').mockImplementation(async () => {});
				const expiration = expirationSeconds * 1000;
				mockGetInfo({ lifetime: expiration });
				setup(<Loader />);
				await act(async () => {
					await vi.advanceTimersToNextTimerAsync();
				});
				await screen.findByText(
					/Your session will expire in \d+ seconds\. After that, you'll be redirected to the login page\./i
				);
				await act(async () => {
					await vi.advanceTimersByTimeAsync(expiration);
				});
				expect(
					logoutFn,
					`logout should be called when the 60 seconds snackbar timeout expires (session lifetime is ${expirationSeconds} seconds)`
				).toHaveBeenCalled();
			}
		);

		test('should show 60 seconds snackbar and hide the 3 minutes snackbar', async () => {
			const threeMinutes = 3 * 60 * 1000;
			mockGetInfo({ lifetime: threeMinutes });
			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});
			await screen.findByText(
				"Your session will expire in 3 minutes. After that, you'll be redirected to the login page."
			);
			await act(async () => {
				await vi.advanceTimersByTimeAsync(2 * 60 * 1000);
			});
			expect(
				await screen.findByText(
					"Your session will expire in 60 seconds. After that, you'll be redirected to the login page."
				),
				'the 60 seconds snackbar should be shown once the session reaches the 60 seconds threshold'
			).toBeVisible();
			expect(
				screen.queryByText(
					"Your session will expire in 3 minutes. After that, you'll be redirected to the login page."
				),
				'the 3 minutes snackbar should be hidden once the 60 seconds snackbar is shown'
			).not.toBeInTheDocument();
		});

		test('should add visibility change event listener', async () => {
			const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
			const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

			mockGetInfo({ lifetime: 10 * 60 * 1000 });
			const { unmount } = setup(<Loader />);

			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});

			// Should have added the visibility change listener
			expect(
				addEventListenerSpy,
				'a visibilitychange listener should be added while the Loader is mounted'
			).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

			unmount();

			// Should have removed the visibility change listener on cleanup
			expect(
				removeEventListenerSpy,
				'the visibilitychange listener should be removed when the Loader is unmounted'
			).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

			addEventListenerSpy.mockRestore();
			removeEventListenerSpy.mockRestore();
		});
	});

	describe('Idle timeout modal', () => {
		test('should show idle timeout modal when zimbraMailIdleSessionTimeout is set and warning time is reached', async () => {
			mockGetInfo({
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '120s' } }
			});

			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});

			// Advance to exactly the warning time (60 seconds before timeout = 60s)
			await act(async () => {
				await vi.advanceTimersByTimeAsync(60 * 1000);
			});

			// Wait for the modal to appear
			await waitFor(() => {
				expect(
					screen.getByText('Inactivity warning'),
					'the inactivity warning modal should appear when the idle warning time is reached'
				).toBeVisible();
			});

			expect(
				screen.getByText(
					`You've been inactive for a while. You'll be logged out soon for security reasons. Press any key or click anywhere to stay logged in.`
				),
				'the inactivity warning modal should display the inactivity message'
			).toBeVisible();
		});

		test('should show "Stay logged in" and "Logout" buttons in idle timeout modal', async () => {
			mockGetInfo({
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '120s' } }
			});

			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});

			await act(async () => {
				await vi.advanceTimersByTimeAsync(60 * 1000);
			});

			// Wait for the modal to appear
			await waitFor(() => {
				expect(
					screen.getByText('Inactivity warning'),
					'the inactivity warning modal should appear when the idle warning time is reached'
				).toBeVisible();
			});

			expect(
				await screen.findByRole('button', { name: /stay logged in/i }),
				'the "Stay logged in" button should be visible in the inactivity warning modal'
			).toBeVisible();
			expect(
				screen.getByRole('button', { name: /logout/i }),
				'the "Logout" button should be visible in the inactivity warning modal'
			).toBeVisible();
		});

		test('should reset idle timeout when clicking "Stay logged in" button', async () => {
			const logoutFn = vi.spyOn(logout, 'logout').mockImplementation(async () => {});
			mockGetInfo({
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '120s' } }
			});

			const { user } = setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});

			// Show warning modal
			await act(async () => {
				await vi.advanceTimersByTimeAsync(60 * 1000);
			});

			const stayLoggedInButton = await screen.findByRole('button', { name: /stay logged in/i });
			await user.click(stayLoggedInButton);

			// Modal should disappear
			expect(
				screen.queryByText('Inactivity warning'),
				'the inactivity warning modal should disappear after clicking "Stay logged in"'
			).not.toBeInTheDocument();

			// Should not logout after original timeout time
			await act(async () => {
				await vi.advanceTimersByTimeAsync(60 * 1000);
			});

			expect(
				logoutFn,
				'logout should not be called after the idle timeout is reset by clicking "Stay logged in"'
			).not.toHaveBeenCalled();
		});

		test('should call logout when clicking "Logout" button in idle timeout modal', async () => {
			const logoutFn = vi.spyOn(logout, 'logout').mockImplementation(async () => {});
			mockGetInfo({
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '120s' } }
			});

			const { user } = setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});

			await act(async () => {
				await vi.advanceTimersByTimeAsync(60 * 1000);
			});

			const logoutButton = await screen.findByRole('button', { name: /logout/i });
			await user.click(logoutButton);

			expect(
				logoutFn,
				'logout should be called when clicking the "Logout" button in the inactivity warning modal'
			).toHaveBeenCalled();
		});

		test('should automatically logout when idle timeout expires without user interaction', async () => {
			const logoutFn = vi.spyOn(logout, 'logout').mockImplementation(async () => {});
			mockGetInfo({
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '120s' } }
			});

			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});

			// Let the full timeout expire
			await act(async () => {
				await vi.advanceTimersByTimeAsync(120 * 1000);
			});

			expect(
				logoutFn,
				'logout should be called automatically when the idle timeout expires without user interaction'
			).toHaveBeenCalled();
		});

		test('should not show idle timeout modal when zimbraMailIdleSessionTimeout is not set', async () => {
			mockGetInfo(); // No zimbraMailIdleSessionTimeout

			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});

			// Advance time significantly
			await act(async () => {
				await vi.advanceTimersByTimeAsync(300 * 1000);
			});

			expect(
				screen.queryByText('Inactivity warning'),
				'the inactivity warning modal should not appear when zimbraMailIdleSessionTimeout is not set'
			).not.toBeInTheDocument();
		});

		test('should not show idle timeout modal when zimbraMailIdleSessionTimeout is 0', async () => {
			mockGetInfo({
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '0s' } }
			});

			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});

			await act(async () => {
				await vi.advanceTimersByTimeAsync(300 * 1000);
			});

			expect(
				screen.queryByText('Inactivity warning'),
				'the inactivity warning modal should not appear when zimbraMailIdleSessionTimeout is 0'
			).not.toBeInTheDocument();
		});

		test('should show idle timeout modal immediately if timeout is less than warning time', async () => {
			mockGetInfo({
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '30s' } }
			});

			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});

			// Wait for the modal to appear
			// Modal should appear immediately since 30s < 60s warning time
			await waitFor(() => {
				expect(
					screen.getByText('Inactivity warning'),
					'the inactivity warning modal should appear immediately when the timeout is less than the warning time'
				).toBeVisible();
			});
		});

		test('should reset idle timeout on user activity and hide modal', async () => {
			const logoutFn = vi.spyOn(logout, 'logout').mockImplementation(async () => {});
			mockGetInfo({
				attrs: { _attrs: { zimbraMailIdleSessionTimeout: '120s' } }
			});

			setup(<Loader />);
			await act(async () => {
				await vi.advanceTimersToNextTimerAsync();
			});

			// Show warning modal
			await act(async () => {
				await vi.advanceTimersByTimeAsync(60 * 1000);
			});

			await waitFor(() => {
				expect(
					screen.getByText('Inactivity warning'),
					'the inactivity warning modal should appear when the idle warning time is reached'
				).toBeVisible();
			});

			// Simulate user activity (mouse click)
			act(() => {
				document.dispatchEvent(new Event('keydown'));
			});

			// Modal should disappear
			await waitFor(() => {
				expect(
					screen.queryByText('Inactivity warning'),
					'the inactivity warning modal should disappear after user activity is detected'
				).not.toBeInTheDocument();
			});

			// Should not logout after original timeout time
			await act(async () => {
				await vi.advanceTimersByTimeAsync(60 * 1000);
			});

			expect(
				logoutFn,
				'logout should not be called after the idle timeout is reset by user activity'
			).not.toHaveBeenCalled();
		});
	});
});
