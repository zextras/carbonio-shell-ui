/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { api } from '@zextras/carbonio-ui-soap-lib';
import { http, HttpResponse } from 'msw';

import { logout } from './logout';
import * as utils from './utils';
import server from '../mocks/server';
import { useLoginConfigStore } from '../store/login/store';
import { controlConsoleError } from '../tests/utils';
import type { ErrorSoapResponse } from '../types/network';

const mockEndSession = (response: HttpResponse): jest.SpyInstance<HttpResponse> =>
	jest.spyOn(api, 'endSession').mockResolvedValueOnce(response);

describe('Logout', () => {
	it('should redirect to login page if EndSession request fails', async () => {
		const goToLoginFn = jest.spyOn(utils, 'goToLogin').mockImplementation();
		mockEndSession(HttpResponse.json({}, { status: 500 }));
		await logout();
		await jest.advanceTimersToNextTimerAsync();
		expect(goToLoginFn).toHaveBeenCalled();
	});

	it('should redirect to login page if /logout request fails', async () => {
		const goToLoginFn = jest.spyOn(utils, 'goToLogin').mockImplementation();
		mockEndSession(HttpResponse.json({}, { status: 500 }));
		await logout();
		await jest.advanceTimersToNextTimerAsync();
		expect(goToLoginFn).toHaveBeenCalled();
	});

	it('should redirect to login page if EndSession throws error', async () => {
		controlConsoleError('Failed to fetch');
		const goToLoginFn = jest.spyOn(utils, 'goToLogin').mockImplementation();
		server.use(http.post('/service/soap/EndSessionRequest', () => HttpResponse.error()));
		mockEndSession(HttpResponse.error());
		await logout();
		await jest.advanceTimersToNextTimerAsync();
		expect(goToLoginFn).toHaveBeenCalled();
	});

	it('should redirect to login page if /logout throws error', async () => {
		controlConsoleError('Failed to fetch');
		const goToLoginFn = jest.spyOn(utils, 'goToLogin').mockImplementation();
		mockEndSession(HttpResponse.error());
		await logout();
		await jest.advanceTimersToNextTimerAsync();
		expect(goToLoginFn).toHaveBeenCalled();
	});

	it('should redirect to login page if EndSession request succeeded with Fault', async () => {
		const goToLoginFn = jest.spyOn(utils, 'goToLogin').mockImplementation();
		mockEndSession(
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
		);
		await logout();
		await jest.advanceTimersToNextTimerAsync();
		expect(goToLoginFn).toHaveBeenCalled();
	});

	describe('with custom logout url', () => {
		it('should redirect to login page if EndSession request fails', async () => {
			useLoginConfigStore.setState({ carbonioWebUiLogoutURL: 'custom logout' });
			const goToFn = jest.spyOn(utils, 'goTo').mockImplementation();
			mockEndSession(HttpResponse.json({}, { status: 500 }));
			await logout();
			await jest.advanceTimersToNextTimerAsync();
			expect(goToFn).toHaveBeenCalled();
		});

		it('should redirect to login page if /logout request fails', async () => {
			useLoginConfigStore.setState({ carbonioWebUiLogoutURL: 'custom logout' });
			const goToFn = jest.spyOn(utils, 'goTo').mockImplementation();
			mockEndSession(HttpResponse.json({}, { status: 500 }));
			await logout();
			await jest.advanceTimersToNextTimerAsync();
			expect(goToFn).toHaveBeenCalled();
		});

		it('should redirect to login page if EndSession throws error', async () => {
			useLoginConfigStore.setState({ carbonioWebUiLogoutURL: 'custom logout' });
			controlConsoleError('Failed to fetch');
			const goToFn = jest.spyOn(utils, 'goTo').mockImplementation();
			mockEndSession(HttpResponse.error());
			await logout();
			await jest.advanceTimersToNextTimerAsync();
			expect(goToFn).toHaveBeenCalled();
		});

		it('should redirect to login page if /logout throws error', async () => {
			useLoginConfigStore.setState({ carbonioWebUiLogoutURL: 'custom logout' });
			controlConsoleError('Failed to fetch');
			const goToFn = jest.spyOn(utils, 'goTo').mockImplementation();
			mockEndSession(HttpResponse.error());
			await logout();
			await jest.advanceTimersToNextTimerAsync();
			expect(goToFn).toHaveBeenCalled();
		});

		it('should redirect to login page if EndSession request succeeded with Fault', async () => {
			useLoginConfigStore.setState({ carbonioWebUiLogoutURL: 'custom logout' });
			const goToFn = jest.spyOn(utils, 'goTo').mockImplementation();
			mockEndSession(
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
			);
			await logout();
			await jest.advanceTimersToNextTimerAsync();
			expect(goToFn).toHaveBeenCalled();
		});
	});
});
