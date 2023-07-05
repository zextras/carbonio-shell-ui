/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { waitFor } from '@testing-library/react';
import { noop } from 'lodash';
import { DefaultBodyType, PathParams, rest } from 'msw';

import { getSoapFetch } from './fetch';
import * as networkUtils from './utils';
import { type ErrorSoapResponse } from '../../types';
import { SHELL_APP_ID } from '../constants';
import server from '../mocks/server';

jest.mock<typeof import('../workers')>('../workers');

describe('Fetch', () => {
	test('should redirect to login if user is not authenticated', async () => {
		server.use(
			rest.post<DefaultBodyType, PathParams, Pick<ErrorSoapResponse, 'Body'>>(
				'/service/soap/SomeRequest',
				(req, res, ctx) =>
					res(
						ctx.json({
							Body: {
								Fault: {
									Reason: { Text: 'Controlled error: auth required' },
									Detail: {
										Error: {
											Code: 'service.AUTH_REQUIRED',
											Detail: ''
										}
									}
								}
							}
						})
					)
			)
		);

		const goToLoginFn = jest.spyOn(networkUtils, 'goToLogin').mockImplementation(noop);

		await getSoapFetch(SHELL_APP_ID)('Some', {});
		await waitFor(() => expect(goToLoginFn).toHaveBeenCalled());
	});

	test('should redirect to login if user session is expired', async () => {
		server.use(
			rest.post<DefaultBodyType, PathParams, Pick<ErrorSoapResponse, 'Body'>>(
				'/service/soap/SomeRequest',
				(req, res, ctx) =>
					res(
						ctx.json({
							Body: {
								Fault: {
									Reason: { Text: 'Controlled error: auth expired' },
									Detail: {
										Error: {
											Code: 'service.AUTH_EXPIRED',
											Detail: ''
										}
									}
								}
							}
						})
					)
			)
		);

		const goToLoginFn = jest.spyOn(networkUtils, 'goToLogin').mockImplementation(noop);

		await getSoapFetch(SHELL_APP_ID)('Some', {});
		await waitFor(() => expect(goToLoginFn).toHaveBeenCalled());
	});
});
