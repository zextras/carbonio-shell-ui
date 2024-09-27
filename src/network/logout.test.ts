/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { http, HttpResponse } from 'msw';

import { logout } from './logout';
import * as utils from './utils';
import server from '../mocks/server';
import { useLoginConfigStore } from '../store/login/store';
import { controlConsoleError } from '../tests/utils';
import type { ErrorSoapResponse } from '../types/network';

describe('Logout', () => {
	it('should redirect to login page if EndSession request fails', async () => {
		const goToLoginFn = jest.spyOn(utils, 'goToLogin').mockImplementation();
		server.use(
			http.post('/service/soap/EndSessionRequest', () => HttpResponse.json({}, { status: 500 }))
		);
		await logout();
		await jest.advanceTimersToNextTimerAsync();
		expect(goToLoginFn).toHaveBeenCalled();
	});

	it('should redirect to login page if /logout request fails', async () => {
		const goToLoginFn = jest.spyOn(utils, 'goToLogin').mockImplementation();
		server.use(http.get('/logout', () => HttpResponse.json({}, { status: 500 })));
		await logout();
		await jest.advanceTimersToNextTimerAsync();
		expect(goToLoginFn).toHaveBeenCalled();
	});

	it('should redirect to login page if EndSession throws error', async () => {
		controlConsoleError('Failed to fetch');
		const goToLoginFn = jest.spyOn(utils, 'goToLogin').mockImplementation();
		server.use(http.post('/service/soap/EndSessionRequest', () => HttpResponse.error()));
		await logout();
		await jest.advanceTimersToNextTimerAsync();
		expect(goToLoginFn).toHaveBeenCalled();
	});

	it('should redirect to login page if /logout throws error', async () => {
		controlConsoleError('Failed to fetch');
		const goToLoginFn = jest.spyOn(utils, 'goToLogin').mockImplementation();
		server.use(http.get('/logout', () => HttpResponse.error()));
		await logout();
		await jest.advanceTimersToNextTimerAsync();
		expect(goToLoginFn).toHaveBeenCalled();
	});

	it('should redirect to login page if EndSession request succeeded with Fault', async () => {
		const goToLoginFn = jest.spyOn(utils, 'goToLogin').mockImplementation();
		server.use(
			http.post('/service/soap/EndSessionRequest', () =>
				HttpResponse.json<ErrorSoapResponse>(
					{
						Header: { context: {} },
						Body: {
							Fault: {
								Code: { Value: '' },
								Detail: {
									Error: {
										Code: '',
										Trace: ''
									}
								},
								Reason: {
									Text: ''
								}
							}
						}
					},
					{ status: 200 }
				)
			)
		);
		await logout();
		await jest.advanceTimersToNextTimerAsync();
		expect(goToLoginFn).toHaveBeenCalled();
	});

	describe('with custom logout url and isManualLogout true', () => {
		it('should redirect to login page if EndSession request fails', async () => {
			useLoginConfigStore.setState({ carbonioWebUiLogoutURL: 'custom logout' });
			const goToFn = jest.spyOn(utils, 'goTo').mockImplementation();
			server.use(
				http.post('/service/soap/EndSessionRequest', () => HttpResponse.json({}, { status: 500 }))
			);
			await logout({ isManualLogout: true });
			await jest.advanceTimersToNextTimerAsync();
			expect(goToFn).toHaveBeenCalled();
		});

		it('should redirect to login page if /logout request fails', async () => {
			useLoginConfigStore.setState({ carbonioWebUiLogoutURL: 'custom logout' });
			const goToFn = jest.spyOn(utils, 'goTo').mockImplementation();
			server.use(http.get('/logout', () => HttpResponse.json({}, { status: 500 })));
			await logout({ isManualLogout: true });
			await jest.advanceTimersToNextTimerAsync();
			expect(goToFn).toHaveBeenCalled();
		});

		it('should redirect to login page if EndSession throws error', async () => {
			useLoginConfigStore.setState({ carbonioWebUiLogoutURL: 'custom logout' });
			controlConsoleError('Failed to fetch');
			const goToFn = jest.spyOn(utils, 'goTo').mockImplementation();
			server.use(http.post('/service/soap/EndSessionRequest', () => HttpResponse.error()));
			await logout({ isManualLogout: true });
			await jest.advanceTimersToNextTimerAsync();
			expect(goToFn).toHaveBeenCalled();
		});

		it('should redirect to login page if /logout throws error', async () => {
			useLoginConfigStore.setState({ carbonioWebUiLogoutURL: 'custom logout' });
			controlConsoleError('Failed to fetch');
			const goToFn = jest.spyOn(utils, 'goTo').mockImplementation();
			server.use(http.get('/logout', () => HttpResponse.error()));
			await logout({ isManualLogout: true });
			await jest.advanceTimersToNextTimerAsync();
			expect(goToFn).toHaveBeenCalled();
		});

		it('should redirect to login page if EndSession request succeeded with Fault', async () => {
			useLoginConfigStore.setState({ carbonioWebUiLogoutURL: 'custom logout' });
			const goToFn = jest.spyOn(utils, 'goTo').mockImplementation();
			server.use(
				http.post('/service/soap/EndSessionRequest', () =>
					HttpResponse.json<ErrorSoapResponse>(
						{
							Header: { context: {} },
							Body: {
								Fault: {
									Code: { Value: '' },
									Detail: {
										Error: {
											Code: '',
											Trace: ''
										}
									},
									Reason: {
										Text: ''
									}
								}
							}
						},
						{ status: 200 }
					)
				)
			);
			await logout({ isManualLogout: true });
			await jest.advanceTimersToNextTimerAsync();
			expect(goToFn).toHaveBeenCalled();
		});
	});
});
