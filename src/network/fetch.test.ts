/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { DefaultBodyType, PathParams } from 'msw';
import { http, HttpResponse } from 'msw';

import { getSoapFetch } from './fetch';
import * as networkUtils from './utils';
import { SHELL_APP_ID } from '../constants';
import server from '../mocks/server';
import type { ErrorSoapResponse } from '../types/network';

describe('Fetch', () => {
	test('should redirect to login if user is not authenticated', async () => {
		server.use(
			http.post<PathParams, DefaultBodyType, Pick<ErrorSoapResponse, 'Body'>>(
				'/service/soap/SomeRequest',
				() =>
					HttpResponse.json({
						Body: {
							Fault: {
								Code: {
									Value: ''
								},
								Reason: { Text: 'Controlled error: auth required' },
								Detail: {
									Error: {
										Code: 'service.AUTH_REQUIRED',
										Trace: ''
									}
								}
							}
						}
					})
			)
		);

		const goToLoginFn = jest.spyOn(networkUtils, 'goToLogin').mockImplementation();

		await expect(getSoapFetch(SHELL_APP_ID)('Some', {})).rejects.toMatchObject({
			message: 'service.AUTH_REQUIRED'
		});
		await jest.advanceTimersToNextTimerAsync();
		expect(goToLoginFn).toHaveBeenCalled();
	});

	test('should redirect to login if user session is expired', async () => {
		server.use(
			http.post<PathParams, DefaultBodyType, Pick<ErrorSoapResponse, 'Body'>>(
				'/service/soap/SomeRequest',
				() =>
					HttpResponse.json({
						Body: {
							Fault: {
								Code: {
									Value: ''
								},
								Reason: { Text: 'Controlled error: auth expired' },
								Detail: {
									Error: {
										Code: 'service.AUTH_EXPIRED',
										Trace: ''
									}
								}
							}
						}
					})
			)
		);

		const goToLoginFn = jest.spyOn(networkUtils, 'goToLogin').mockImplementation();

		await expect(getSoapFetch(SHELL_APP_ID)('Some', {})).rejects.toMatchObject({
			message: 'service.AUTH_EXPIRED'
		});
		await jest.advanceTimersToNextTimerAsync();
		expect(goToLoginFn).toHaveBeenCalled();
	});
});
