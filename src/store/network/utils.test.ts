/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { NoOpResponse } from '@zextras/carbonio-mailbox-api-ui';

import { useNetworkStore } from './store';
import { getPollingInterval } from './utils';
import { JSNS } from '../../constants';
import type { Duration } from '../../types/account';
import type { RawSoapResponse } from '../../types/network';
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

			describe('long polling cases', () => {
				it('should return 500 if zimbraPrefMailPollingInterval is "500" without a duration unit', () => {
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

				it('should return 500 if zimbraPrefMailPollingInterval is "500ms"', () => {
					useNetworkStore.setState({ pollingInterval: 123456789 });
					useAccountStore.setState((state) => ({
						...state,
						settings: {
							...state.settings,
							prefs: {
								...state.settings.prefs,
								zimbraPrefMailPollingInterval: '500ms' satisfies Duration
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
					expect(result).toBe(500);
				});

				it('should return 500 if zimbraPrefMailPollingInterval is "500s"', () => {
					useNetworkStore.setState({ pollingInterval: 123456789 });
					useAccountStore.setState((state) => ({
						...state,
						settings: {
							...state.settings,
							prefs: {
								...state.settings.prefs,
								zimbraPrefMailPollingInterval: '500s' satisfies Duration
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
					expect(result).toBe(500);
				});
			});

			it('should return the number * 1000 if zimbraPrefMailPollingInterval is set without a duration unit(so are handled as seconds)', () => {
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
				expect(result).toBe(753_000);
			});

			it('should return the number if zimbraPrefMailPollingInterval is set with the duration unit ms (milliseconds)', () => {
				useNetworkStore.setState({ pollingInterval: 123456789 });
				useAccountStore.setState((state) => ({
					...state,
					settings: {
						...state.settings,
						prefs: {
							...state.settings.prefs,
							zimbraPrefMailPollingInterval: '284ms' satisfies Duration
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
				expect(result).toBe(284);
			});

			it('should return the number * 1000 if zimbraPrefMailPollingInterval is set with the duration unit s (seconds)', () => {
				useNetworkStore.setState({ pollingInterval: 123456789 });
				useAccountStore.setState((state) => ({
					...state,
					settings: {
						...state.settings,
						prefs: {
							...state.settings.prefs,
							zimbraPrefMailPollingInterval: '753s' satisfies Duration
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

			it('should return the number * 60 * 1000 if zimbraPrefMailPollingInterval duration is set with the duration unit m (minutes)', () => {
				useNetworkStore.setState({ pollingInterval: 123456789 });
				useAccountStore.setState((state) => ({
					...state,
					settings: {
						...state.settings,
						prefs: {
							...state.settings.prefs,
							zimbraPrefMailPollingInterval: '50m' satisfies Duration
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
				expect(result).toBe(50 * 60 * 1000);
			});

			it('should return the number * 60 * 60 * 1000 if zimbraPrefMailPollingInterval is set with the duration unit h (hours)', () => {
				useNetworkStore.setState({ pollingInterval: 123456789 });
				useAccountStore.setState((state) => ({
					...state,
					settings: {
						...state.settings,
						prefs: {
							...state.settings.prefs,
							zimbraPrefMailPollingInterval: '2h' satisfies Duration
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
				expect(result).toBe(2 * 60 * 60 * 1000);
			});

			it('should return the number * 24 * 60 * 60 * 1000 if zimbraPrefMailPollingInterval is set with the duration unit d (days)', () => {
				useNetworkStore.setState({ pollingInterval: 123456789 });
				useAccountStore.setState((state) => ({
					...state,
					settings: {
						...state.settings,
						prefs: {
							...state.settings.prefs,
							zimbraPrefMailPollingInterval: '2d' satisfies Duration
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
				expect(result).toBe(2 * 24 * 60 * 60 * 1000);
			});
		});
	});
});
