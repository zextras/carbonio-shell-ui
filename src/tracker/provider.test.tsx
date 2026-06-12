/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect } from 'react';

import { act } from '@testing-library/react';
import type { AccountSettingsPrefs } from '@zextras/carbonio-ui-soap-lib';
import type { PostHog, PostHogConfig } from 'posthog-js';
import posthogJs from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

import { TrackerProvider } from './provider';
import { useAccountStore } from '../store/account';
import { useLoginConfigStore } from '../store/login/store';
import { mockedAccount } from '../tests/account-utils';
import { spyOnPosthog } from '../tests/posthog-utils';
import { screen, setup } from '../tests/utils';
import * as utils from '../utils/utils';

type InitOptions = Partial<PostHogConfig> & { loaded?: (ph: PostHog) => void };

beforeEach(() => {
	vi.spyOn(utils, 'getCurrentLocationHost').mockReturnValue('differentHost');
	posthogJs.__loaded = false;
});

const setSendAnalytics = (value: AccountSettingsPrefs['carbonioPrefSendAnalytics']): void => {
	useAccountStore.setState((state) => ({
		...state,
		settings: {
			...state.settings,
			prefs: { ...state.settings.prefs, carbonioPrefSendAnalytics: value }
		}
	}));
};

const getInitOptions = (): InitOptions | undefined =>
	vi.mocked(posthogJs.init).mock.lastCall?.[1] as InitOptions | undefined;

describe('TrackerProvider', () => {
	it('should init posthog with the expected config when carbonioPrefSendAnalytics is TRUE', () => {
		setSendAnalytics('TRUE');
		const mockProvider = vi.mocked(PostHogProvider);
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(
			posthogJs.init,
			'posthog should be initialized with the privacy-preserving config and the api key when analytics is enabled'
		).toHaveBeenLastCalledWith(
			POSTHOG_API_KEY,
			expect.objectContaining<Partial<PostHogConfig>>({
				opt_out_capturing_by_default: true,
				disable_session_recording: true,
				disable_surveys: true
			})
		);
		expect(
			mockProvider,
			'PostHogProvider should receive the posthog singleton as client'
		).toHaveBeenLastCalledWith(expect.objectContaining({ client: posthogJs }), expect.anything());
		expect(
			screen.getByTestId('child'),
			'children should be rendered when analytics is enabled'
		).toBeVisible();
	});

	it.each<AccountSettingsPrefs['carbonioPrefSendAnalytics']>(['FALSE', undefined])(
		'should mount PostHogProvider but not init posthog when carbonioPrefSendAnalytics is %s',
		(value) => {
			setSendAnalytics(value);
			const mockProvider = vi.mocked(PostHogProvider);
			const posthog = spyOnPosthog({ loaded: true });
			setup(
				<TrackerProvider>
					<div data-testid={'child'} />
				</TrackerProvider>
			);
			expect(
				mockProvider,
				'PostHogProvider should always mount to keep the tree shape stable'
			).toHaveBeenCalled();
			expect(
				posthogJs.init,
				`posthog should not be initialized when carbonioPrefSendAnalytics is ${value}`
			).not.toHaveBeenCalled();
			expect(
				posthog.opt_in_capturing,
				`PostHog should not opt-in when carbonioPrefSendAnalytics is ${value}`
			).not.toHaveBeenCalled();
			expect(
				screen.getByTestId('child'),
				'children should still be rendered even when analytics is disabled'
			).toBeVisible();
		}
	);

	it('should not remount children when carbonioPrefSendAnalytics arrives after login', () => {
		const onMount = vi.fn();
		const Probe = (): null => {
			useEffect(() => {
				onMount();
			}, []);
			return null;
		};
		setSendAnalytics(undefined);
		setup(
			<TrackerProvider>
				<Probe />
			</TrackerProvider>
		);
		expect(onMount, 'children should mount once at boot').toHaveBeenCalledTimes(1);
		act(() => {
			setSendAnalytics('TRUE');
		});
		expect(
			onMount,
			'children must not remount when the analytics pref becomes TRUE, ' +
				'otherwise the whole app below TrackerProvider boots twice (e.g. getComponents fires twice)'
		).toHaveBeenCalledTimes(1);
	});

	it('should init posthog only when carbonioPrefSendAnalytics becomes TRUE, and only once', () => {
		setSendAnalytics(undefined);
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(
			posthogJs.init,
			'posthog should not be initialized while the analytics pref is unknown'
		).not.toHaveBeenCalled();
		act(() => {
			setSendAnalytics('TRUE');
		});
		expect(
			posthogJs.init,
			'posthog should be initialized when the analytics pref arrives as TRUE'
		).toHaveBeenCalledTimes(1);
		// simulate the __loaded flag set by the real posthog.init
		posthogJs.__loaded = true;
		act(() => {
			setSendAnalytics('FALSE');
		});
		act(() => {
			setSendAnalytics('TRUE');
		});
		expect(
			posthogJs.init,
			'posthog should not be re-initialized when the pref is toggled within the session'
		).toHaveBeenCalledTimes(1);
	});

	it('should identify the user via the loaded callback', async () => {
		setSendAnalytics('TRUE');
		useAccountStore.setState({ account: mockedAccount });
		const posthog = spyOnPosthog();
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		const options = getInitOptions();
		options?.loaded?.(posthog as unknown as PostHog);
		await vi.advanceTimersByTimeAsync(0);
		expect(
			posthog.identify,
			'loaded callback should identify the user via their hashed id'
		).toHaveBeenCalledWith('mEAzl8Lcf4UJ+/uFXopfi6SaL55V61IdfIWCruI7O2Q=');
	});

	it('should opt-in PostHog via the loaded callback (overrides any persisted opt-out state)', () => {
		setSendAnalytics('TRUE');
		const posthog = spyOnPosthog();
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		const options = getInitOptions();
		options?.loaded?.(posthog as unknown as PostHog);
		expect(
			posthog.opt_in_capturing,
			'loaded callback should opt-in PostHog, overriding any persisted opt-out state'
		).toHaveBeenCalled();
	});

	it.each(['localhost', '127.0.0.1'])(
		'should not identify nor opt-in via the loaded callback if host is %s',
		(host) => {
			vi.spyOn(utils, 'getCurrentLocationHost').mockReturnValue(host);
			setSendAnalytics('TRUE');
			useAccountStore.setState({ account: mockedAccount });
			const posthog = spyOnPosthog();
			setup(
				<TrackerProvider>
					<div data-testid={'child'} />
				</TrackerProvider>
			);
			const options = getInitOptions();
			options?.loaded?.(posthog as unknown as PostHog);
			expect(
				posthog.identify,
				`loaded callback should not identify the user when host is ${host}`
			).not.toHaveBeenCalled();
			expect(
				posthog.opt_in_capturing,
				`loaded callback should not opt-in PostHog when host is ${host}`
			).not.toHaveBeenCalled();
		}
	);

	it('should not opt-in via the loaded callback if the pref was switched off while posthog was loading', () => {
		setSendAnalytics('TRUE');
		useAccountStore.setState({ account: mockedAccount });
		const posthog = spyOnPosthog();
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(
			posthogJs.init,
			'posthog should be initialized when analytics is enabled'
		).toHaveBeenCalled();
		act(() => {
			setSendAnalytics('FALSE');
		});
		const options = getInitOptions();
		options?.loaded?.(posthog as unknown as PostHog);
		expect(
			posthog.opt_in_capturing,
			'loaded callback should not opt-in when the pref was switched off while loading'
		).not.toHaveBeenCalled();
		expect(
			posthog.identify,
			'loaded callback should not identify the user when the pref was switched off while loading'
		).not.toHaveBeenCalled();
		expect(
			posthog.setPersonProperties,
			'loaded callback should not set person properties when the pref was switched off while loading'
		).not.toHaveBeenCalled();
	});
});

describe('TrackerSetup', () => {
	it.each([true, false])(
		'should set is_ce person property to %s when CE state is known',
		(isCE) => {
			setSendAnalytics('TRUE');
			useLoginConfigStore.setState({ isCarbonioCE: isCE });
			const posthog = spyOnPosthog({ loaded: true });
			setup(
				<TrackerProvider>
					<div data-testid={'child'} />
				</TrackerProvider>
			);
			expect(
				posthog.setPersonProperties,
				`is_ce person property should be set to ${isCE} when CE state is known`
			).toHaveBeenCalledWith({ is_ce: isCE });
		}
	);

	it('should not set is_ce person property when CE state is undefined', () => {
		setSendAnalytics('TRUE');
		useLoginConfigStore.setState({ isCarbonioCE: undefined });
		const posthog = spyOnPosthog({ loaded: true });
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(
			posthog.setPersonProperties,
			'is_ce person property should not be set when CE state is undefined'
		).not.toHaveBeenCalled();
	});

	it('should NOT set is_ce nor configure surveys via mount effect if posthog is not yet loaded', () => {
		setSendAnalytics('TRUE');
		useLoginConfigStore.setState({ isCarbonioCE: true });
		const posthog = spyOnPosthog();
		// __loaded is undefined on the stub → pre-init mutations would be silent no-ops in real posthog-js
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(
			posthog.setPersonProperties,
			'setPersonProperties should not be called via mount effect when posthog is not yet loaded'
		).not.toHaveBeenCalled();
		expect(
			posthog.set_config,
			'set_config should not be called via mount effect when posthog is not yet loaded'
		).not.toHaveBeenCalled();
	});

	it('should enable surveys when Carbonio is CE', () => {
		setSendAnalytics('TRUE');
		useLoginConfigStore.setState({ isCarbonioCE: true });
		const posthog = spyOnPosthog({ loaded: true });
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(
			posthog.set_config,
			'surveys should be enabled (disable_surveys false) when Carbonio is CE'
		).toHaveBeenCalledWith({ disable_surveys: false });
	});

	it('should not call set_config when Carbonio is not CE (config already disables surveys)', () => {
		setSendAnalytics('TRUE');
		useLoginConfigStore.setState({ isCarbonioCE: false });
		const posthog = spyOnPosthog({ loaded: true });
		vi.mocked(posthog.config)!.disable_surveys = true;
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(
			posthog.set_config,
			'set_config should not be called when Carbonio is not CE and surveys are already disabled'
		).not.toHaveBeenCalled();
	});

	it('should re-apply config when CE state changes', () => {
		setSendAnalytics('TRUE');
		useLoginConfigStore.setState({ isCarbonioCE: false });
		const posthog = spyOnPosthog({ loaded: true });
		vi.mocked(posthog.config)!.disable_surveys = true;
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(
			posthog.set_config,
			'set_config should not be called initially when surveys are already disabled and CE is false'
		).not.toHaveBeenCalled();
		act(() => {
			useLoginConfigStore.setState({ isCarbonioCE: true });
		});
		expect(
			posthog.set_config,
			'set_config should re-apply to enable surveys when CE state changes to true'
		).toHaveBeenCalledWith({ disable_surveys: false });
	});

	it('should NOT run setup effects when carbonioPrefSendAnalytics is FALSE', () => {
		setSendAnalytics('FALSE');
		useLoginConfigStore.setState({ isCarbonioCE: true });
		const posthog = spyOnPosthog({ loaded: true });
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(
			posthog.setPersonProperties,
			'setPersonProperties should not run when carbonioPrefSendAnalytics is FALSE'
		).not.toHaveBeenCalled();
		expect(
			posthog.set_config,
			'set_config should not run when carbonioPrefSendAnalytics is FALSE'
		).not.toHaveBeenCalled();
	});

	it.each([true, false])(
		'should set is_ce person property to %s via the loaded callback (initial setup post-init)',
		(isCE) => {
			setSendAnalytics('TRUE');
			useLoginConfigStore.setState({ isCarbonioCE: isCE });
			const posthog = spyOnPosthog();
			setup(
				<TrackerProvider>
					<div data-testid={'child'} />
				</TrackerProvider>
			);
			const options = getInitOptions();
			options?.loaded?.(posthog as unknown as PostHog);
			expect(
				posthog.setPersonProperties,
				`loaded callback should set is_ce person property to ${isCE}`
			).toHaveBeenCalledWith({ is_ce: isCE });
			if (isCE) {
				expect(
					posthog.set_config,
					'loaded callback should enable surveys when Carbonio is CE'
				).toHaveBeenCalledWith({ disable_surveys: false });
			} else {
				expect(
					posthog.set_config,
					'loaded callback should not reconfigure surveys when the init config already disables them'
				).not.toHaveBeenCalled();
			}
		}
	);

	it('should NOT apply CE state via the loaded callback when CE state is undefined', () => {
		setSendAnalytics('TRUE');
		useLoginConfigStore.setState({ isCarbonioCE: undefined });
		const posthog = spyOnPosthog();
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		const options = getInitOptions();
		options?.loaded?.(posthog as unknown as PostHog);
		expect(
			posthog.setPersonProperties,
			'loaded callback should not set is_ce person property when CE state is undefined'
		).not.toHaveBeenCalled();
		expect(
			posthog.set_config,
			'loaded callback should not configure surveys when CE state is undefined'
		).not.toHaveBeenCalled();
	});

	it('should opt-out PostHog when carbonioPrefSendAnalytics changes from TRUE to FALSE', () => {
		setSendAnalytics('TRUE');
		const posthog = spyOnPosthog({ loaded: true });
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(
			posthog.opt_out_capturing,
			'PostHog should not be opted out while analytics is still enabled'
		).not.toHaveBeenCalled();
		act(() => {
			setSendAnalytics('FALSE');
		});
		expect(
			posthog.opt_out_capturing,
			'PostHog should opt out when carbonioPrefSendAnalytics changes from TRUE to FALSE'
		).toHaveBeenCalled();
	});

	it('should NOT explicitly opt-in PostHog on first mount (relies on opt_out_capturing_by_default and loaded callback)', () => {
		setSendAnalytics('TRUE');
		const posthog = spyOnPosthog();
		// __loaded is undefined on the stub → simulates singleton not yet initialised
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(
			posthog.opt_in_capturing,
			'PostHog should not be explicitly opted in on first mount when the singleton is not yet loaded'
		).not.toHaveBeenCalled();
	});

	it('should explicitly opt-in PostHog when singleton is already loaded (toggle FALSE → TRUE in session)', () => {
		setSendAnalytics('TRUE');
		const posthog = spyOnPosthog({ loaded: true });
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(
			posthog.opt_in_capturing,
			'PostHog should be explicitly opted in on mount when the singleton is already loaded'
		).toHaveBeenCalled();
	});

	it('should opt-in and identify when carbonioPrefSendAnalytics becomes TRUE after posthog is loaded (boot flow)', async () => {
		setSendAnalytics(undefined);
		useAccountStore.setState({ account: mockedAccount });
		const posthog = spyOnPosthog({ loaded: true });
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(
			posthog.opt_in_capturing,
			'PostHog should not opt-in while the analytics pref is still unknown'
		).not.toHaveBeenCalled();
		act(() => {
			setSendAnalytics('TRUE');
		});
		expect(
			posthog.opt_in_capturing,
			'PostHog should opt-in when the analytics pref arrives as TRUE after load'
		).toHaveBeenCalled();
		await vi.advanceTimersByTimeAsync(0);
		expect(
			posthog.identify,
			'the user should be identified when the analytics pref arrives as TRUE after load'
		).toHaveBeenCalledWith('mEAzl8Lcf4UJ+/uFXopfi6SaL55V61IdfIWCruI7O2Q=');
	});

	it.each(['localhost', '127.0.0.1'])(
		'should NOT opt-in via mount effect if host is %s (even when singleton is already loaded)',
		(host) => {
			vi.spyOn(utils, 'getCurrentLocationHost').mockReturnValue(host);
			setSendAnalytics('TRUE');
			const posthog = spyOnPosthog({ loaded: true });
			setup(
				<TrackerProvider>
					<div data-testid={'child'} />
				</TrackerProvider>
			);
			expect(
				posthog.opt_in_capturing,
				`PostHog should not opt in via mount effect when host is ${host}, even if the singleton is loaded`
			).not.toHaveBeenCalled();
		}
	);
});
