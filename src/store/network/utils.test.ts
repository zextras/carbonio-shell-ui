/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useNetworkStore } from './store';
import { getPollingInterval } from './utils';
import { JSNS } from '../../constants';
import type { Duration, DurationUnit } from '../../types/account';
import type { NoOpResponse, RawSoapResponse } from '../../types/network';
import { useAccountStore } from '../account';

describe('Utils', () => {
	describe('getPollingInterval', () => {
		it('should return 10000 if the response is a NoOp with waitDisallowed set to true', () => {
			useNetworkStore.setState({ pollingInterval: 123456789 });
			useAccountStore.setState((state) => ({
				...state,
				settings: {
					...state.settings,
					prefs: { ...state.settings.prefs, zimbraPrefMailPollingInterval: '500' }
				}
			}));
			const noOpResponse = {
				Header: {
					context: {}
				},
				Body: {
					NoOpResponse: {
						_jsns: JSNS.mail,
						waitDisallowed: true
					}
				}
			} satisfies RawSoapResponse<{
				NoOpResponse: NoOpResponse;
			}>;
			const result = getPollingInterval(noOpResponse);
			expect(result).toBe(10000);
		});

		it('should return 60000 if the NoOp response includes a Fault', () => {
			useNetworkStore.setState({ pollingInterval: 123456789 });
			useAccountStore.setState((state) => ({
				...state,
				settings: {
					...state.settings,
					prefs: { ...state.settings.prefs, zimbraPrefMailPollingInterval: '500' }
				}
			}));
			const noOpResponse = {
				Header: {
					context: {}
				},
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
					},
					NoOpResponse: {
						_jsns: JSNS.mail,
						waitDisallowed: true
					}
				}
			} satisfies RawSoapResponse<{ NoOpResponse: NoOpResponse }>;
			const result = getPollingInterval(noOpResponse);
			expect(result).toBe(60000);
		});
		describe('without Fault nor waitDisallowed', () => {
			it('should return 30000 if zimbraPrefMailPollingInterval is not a valid duration', () => {
				useNetworkStore.setState({ pollingInterval: 123456789 });
				useAccountStore.setState((state) => ({
					...state,
					settings: {
						...state.settings,
						prefs: {
							...state.settings.prefs,
							zimbraPrefMailPollingInterval: 'invalid string' as Duration
						}
					}
				}));
				const response = {
					Header: {
						context: {}
					},
					Body: {}
				} satisfies RawSoapResponse<Record<string, unknown>>;
				const result = getPollingInterval(response);
				expect(result).toBe(30000);
			});

			// Characterization test: why the 500 absolute number is treated differently from the other absolute numbers?
			it('should return 500 zimbraPrefMailPollingInterval is "500"', () => {
				useNetworkStore.setState({ pollingInterval: 123456789 });
				useAccountStore.setState((state) => ({
					...state,
					settings: {
						...state.settings,
						prefs: { ...state.settings.prefs, zimbraPrefMailPollingInterval: '500' }
					}
				}));
				const response = {
					Header: {
						context: {}
					},
					Body: {}
				} satisfies RawSoapResponse<Record<string, unknown>>;
				const result = getPollingInterval(response);
				expect(result).toBe(500);
			});

			it('should return the number * 1000 if zimbraPrefMailPollingInterval is set without a duration unit', () => {
				useNetworkStore.setState({ pollingInterval: 123456789 });
				useAccountStore.setState((state) => ({
					...state,
					settings: {
						...state.settings,
						prefs: {
							...state.settings.prefs,
							zimbraPrefMailPollingInterval: '753' satisfies Duration
						}
					}
				}));
				const response = {
					Header: {
						context: {}
					},
					Body: {}
				} satisfies RawSoapResponse<Record<string, unknown>>;
				const result = getPollingInterval(response);
				expect(result).toBe(753000);
			});

			// Characterization test: considering that the returned value is used in a timeout (milliseconds),
			// the conversion from ms is wrong
			it.each<DurationUnit>(['m', 'ms'])(
				'should return the number * 60 * 1000 if zimbraPrefMailPollingInterval duration is set with the duration unit %s',
				(durationUnit) => {
					useNetworkStore.setState({ pollingInterval: 123456789 });
					useAccountStore.setState((state) => ({
						...state,
						settings: {
							...state.settings,
							prefs: {
								...state.settings.prefs,
								zimbraPrefMailPollingInterval: `5${durationUnit}` satisfies Duration
							}
						}
					}));
					const response = {
						Header: {
							context: {}
						},
						Body: {}
					} satisfies RawSoapResponse<Record<string, unknown>>;
					const result = getPollingInterval(response);
					expect(result).toBe(5 * 60 * 1000);
				}
			);

			// Characterization test: considering that the returned value is used in a timeout (milliseconds), only the
			// conversion from s is right, while the conversion from h and d are wrong
			it.each<DurationUnit>(['s', 'h', 'd'])(
				'should return the number * 1000 if zimbraPrefMailPollingInterval is set with the duration unit %s',
				(durationUnit) => {
					useNetworkStore.setState({ pollingInterval: 123456789 });
					useAccountStore.setState((state) => ({
						...state,
						settings: {
							...state.settings,
							prefs: {
								...state.settings.prefs,
								zimbraPrefMailPollingInterval: `753${durationUnit}` satisfies Duration
							}
						}
					}));
					const response = {
						Header: {
							context: {}
						},
						Body: {}
					} satisfies RawSoapResponse<Record<string, unknown>>;
					const result = getPollingInterval(response);
					expect(result).toBe(753000);
				}
			);
		});
	});
});
