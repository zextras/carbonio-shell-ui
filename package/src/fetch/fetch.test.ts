// /*
//  * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
//  *
//  * SPDX-License-Identifier: AGPL-3.0-only
//  */
// import { waitFor } from '@testing-library/react';
// import { produce } from 'immer';
// import { noop } from 'lodash';
// import type { DefaultBodyType, PathParams } from 'msw';
// import { http, HttpResponse } from 'msw';
//
// import type { NoOpRequest, NoOpResponse } from './fetch';
// import { getSoapFetch } from './fetch';
// import * as networkUtils from './utils';
// import { SHELL_APP_ID } from '../constants';
// import { noOpRequest } from '../mocks/handlers/noOpRequest';
// import server from '../mocks/server';
// import { useAccountStore } from '../store/account';
// import { useNetworkStore } from '../store/network';
// import type { AccountState, Duration } from '../types/account';
// import type { ErrorSoapResponse, SoapRequest, SoapResponse } from '../types/network';
//
// describe('Fetch', () => {
// 	test('should redirect to login if user is not authenticated', async () => {
// 		server.use(
// 			http.post<PathParams, DefaultBodyType, Pick<ErrorSoapResponse, 'Body'>>(
// 				'/service/soap/SomeRequest',
// 				() =>
// 					HttpResponse.json({
// 						Body: {
// 							Fault: {
// 								Code: {
// 									Value: ''
// 								},
// 								Reason: { Text: 'Controlled error: auth required' },
// 								Detail: {
// 									Error: {
// 										Code: 'service.AUTH_REQUIRED',
// 										Trace: ''
// 									}
// 								}
// 							}
// 						}
// 					})
// 			)
// 		);
//
// 		const goToLoginFn = jest.spyOn(networkUtils, 'goToLogin').mockImplementation(noop);
//
// 		await getSoapFetch(SHELL_APP_ID)('Some', {});
// 		await waitFor(() => expect(goToLoginFn).toHaveBeenCalled());
// 	});
//
// 	test('should redirect to login if user session is expired', async () => {
// 		server.use(
// 			http.post<PathParams, DefaultBodyType, Pick<ErrorSoapResponse, 'Body'>>(
// 				'/service/soap/SomeRequest',
// 				() =>
// 					HttpResponse.json({
// 						Body: {
// 							Fault: {
// 								Code: {
// 									Value: ''
// 								},
// 								Reason: { Text: 'Controlled error: auth expired' },
// 								Detail: {
// 									Error: {
// 										Code: 'service.AUTH_EXPIRED',
// 										Trace: ''
// 									}
// 								}
// 							}
// 						}
// 					})
// 			)
// 		);
//
// 		const goToLoginFn = jest.spyOn(networkUtils, 'goToLogin').mockImplementation(noop);
//
// 		await getSoapFetch(SHELL_APP_ID)('Some', {});
// 		await waitFor(() => expect(goToLoginFn).toHaveBeenCalled());
// 	});
//
// 	describe('NoOp polling', () => {
// 		it('should set noOp timeout if response has a Header.context', async () => {
// 			server.use(
// 				http.post<PathParams, DefaultBodyType, SoapResponse<unknown>>(
// 					'/service/soap/SomeRequest',
// 					() =>
// 						HttpResponse.json({
// 							Body: {},
// 							Header: {
// 								context: {}
// 							}
// 						})
// 				)
// 			);
//
// 			expect(useNetworkStore.getState().noOpTimeout).toBeUndefined();
// 			await getSoapFetch(SHELL_APP_ID)('Some', {});
// 			await jest.advanceTimersToNextTimerAsync();
// 			expect(useNetworkStore.getState().noOpTimeout).toBeDefined();
// 		});
//
// 		it.each<[number, Duration]>([
// 			[500, '500'],
// 			[500, '500ms'],
// 			[758, '758ms'],
// 			[123 * 1000, '123s'],
// 			[45 * 60 * 1000, '45m'],
// 			[7 * 60 * 60 * 1000, '7h'],
// 			[3 * 24 * 60 * 60 * 1000, '3d'],
// 			[30 * 1000, '5invalid' as Duration]
// 		])(
// 			'should call noOp after %s ms if zimbraPrefMailPollingInterval is %s',
// 			async (timout, pollingPref) => {
// 				useAccountStore.setState(
// 					produce<AccountState>((state) => {
// 						state.settings.prefs.zimbraPrefMailPollingInterval = pollingPref;
// 					})
// 				);
//
// 				const handlerFn = jest.fn(noOpRequest);
// 				server.use(
// 					http.post<PathParams, DefaultBodyType, SoapResponse<unknown>>(
// 						'/service/soap/SomeRequest',
// 						() =>
// 							HttpResponse.json({
// 								Body: {},
// 								Header: {
// 									context: {}
// 								}
// 							})
// 					),
// 					http.post('/service/soap/NoOpRequest', handlerFn)
// 				);
//
// 				await getSoapFetch(SHELL_APP_ID)('Some', {});
// 				await jest.advanceTimersByTimeAsync(timout);
// 				expect(handlerFn).toHaveBeenCalledTimes(1);
// 			}
// 		);
//
// 		it.each<Duration>(['500', '500ms', '500s'])(
// 			'should send limitToOneBlocked and wait if zimbraPrefMailPollingInterval is %s',
// 			async (pollingPref) => {
// 				useAccountStore.setState(
// 					produce<AccountState>((state) => {
// 						state.settings.prefs.zimbraPrefMailPollingInterval = pollingPref;
// 					})
// 				);
//
// 				let noOpRequestBody: SoapRequest<{ NoOpRequest: NoOpRequest }> | undefined;
// 				server.use(
// 					http.post<PathParams, DefaultBodyType, SoapResponse<unknown>>(
// 						'/service/soap/SomeRequest',
// 						() =>
// 							HttpResponse.json({
// 								Body: {},
// 								Header: {
// 									context: {}
// 								}
// 							})
// 					),
// 					http.post<never, SoapRequest<{ NoOpRequest: NoOpRequest }>, SoapResponse<NoOpResponse>>(
// 						'/service/soap/NoOpRequest',
// 						async (info) => {
// 							noOpRequestBody = await info.request.json();
// 							return noOpRequest(info);
// 						}
// 					)
// 				);
//
// 				await getSoapFetch(SHELL_APP_ID)('Some', {});
// 				await jest.advanceTimersToNextTimerAsync();
// 				expect(noOpRequestBody).toMatchObject(
// 					expect.objectContaining({
// 						Body: {
// 							NoOpRequest: expect.objectContaining({
// 								limitToOneBlocked: 1,
// 								wait: 1
// 							})
// 						}
// 					})
// 				);
// 			}
// 		);
//
// 		it('should not send limitToOneBlocked and wait if zimbraPrefMailPollingInterval is not either 500, 500ms or 500s', async () => {
// 			useAccountStore.setState(
// 				produce<AccountState>((state) => {
// 					state.settings.prefs.zimbraPrefMailPollingInterval = '60s';
// 				})
// 			);
//
// 			let noOpRequestBody: SoapRequest<{ NoOpRequest: NoOpRequest }> | undefined;
// 			server.use(
// 				http.post<PathParams, DefaultBodyType, SoapResponse<unknown>>(
// 					'/service/soap/SomeRequest',
// 					() =>
// 						HttpResponse.json({
// 							Body: {},
// 							Header: {
// 								context: {}
// 							}
// 						})
// 				),
// 				http.post<never, SoapRequest<{ NoOpRequest: NoOpRequest }>, SoapResponse<NoOpResponse>>(
// 					'/service/soap/NoOpRequest',
// 					async (info) => {
// 						noOpRequestBody = await info.request.json();
// 						return noOpRequest(info);
// 					}
// 				)
// 			);
//
// 			await getSoapFetch(SHELL_APP_ID)('Some', {});
// 			await jest.advanceTimersToNextTimerAsync();
// 			expect(noOpRequestBody).not.toMatchObject(
// 				expect.objectContaining({
// 					Body: {
// 						NoOpRequest: expect.objectContaining({
// 							limitToOneBlocked: 1,
// 							wait: 1
// 						})
// 					}
// 				})
// 			);
// 		});
// 	});
// });
