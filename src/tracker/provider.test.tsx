/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { act } from '@testing-library/react';
import type { AccountSettingsPrefs } from '@zextras/carbonio-ui-soap-lib';
import type { PostHog, PostHogConfig } from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import type * as PostHogReact from 'posthog-js/react';

import { TrackerProvider } from './provider';
import { useAccountStore } from '../store/account';
import { useLoginConfigStore } from '../store/login/store';
import { mockedAccount } from '../tests/account-utils';
import { spyOnPosthog } from '../tests/posthog-utils';
import { screen, setup } from '../tests/utils';
import * as utils from '../utils/utils';

beforeEach(() => {
	vi.spyOn(utils, 'getCurrentLocationHost').mockReturnValue('differentHost');
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

describe('TrackerProvider', () => {
	it('should mount PostHogProvider with the expected config when carbonioPrefSendAnalytics is TRUE', () => {
		setSendAnalytics('TRUE');
		const mockProvider = vi.mocked(PostHogProvider);
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		type PostHogProviderProps = React.ComponentPropsWithoutRef<
			(typeof PostHogReact)['PostHogProvider']
		>;
		expect(mockProvider).toHaveBeenLastCalledWith(
			expect.objectContaining<PostHogProviderProps>({
				options: expect.objectContaining<NonNullable<PostHogProviderProps['options']>>({
					opt_out_capturing_by_default: true,
					disable_session_recording: true,
					disable_surveys: true
				}),
				apiKey: POSTHOG_API_KEY
			}),
			expect.anything()
		);
		expect(screen.getByTestId('child')).toBeVisible();
	});

	it.each<AccountSettingsPrefs['carbonioPrefSendAnalytics']>(['FALSE', undefined])(
		'should not mount PostHogProvider when carbonioPrefSendAnalytics is %s',
		(value) => {
			setSendAnalytics(value);
			const mockProvider = vi.mocked(PostHogProvider);
			setup(
				<TrackerProvider>
					<div data-testid={'child'} />
				</TrackerProvider>
			);
			expect(mockProvider).not.toHaveBeenCalled();
			expect(screen.getByTestId('child')).toBeVisible();
		}
	);

	it('should identify the user via the loaded callback', async () => {
		setSendAnalytics('TRUE');
		useAccountStore.setState({ account: mockedAccount });
		const mockProvider = vi.mocked(PostHogProvider);
		const posthog = spyOnPosthog();
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		const { lastCall } = mockProvider.mock;
		const options = lastCall?.[0].options as Partial<PostHogConfig> & {
			loaded?: (ph: PostHog) => void;
		};
		options.loaded?.(posthog as unknown as PostHog);
		await vi.advanceTimersByTimeAsync(0);
		expect(posthog.identify).toHaveBeenCalledWith('mEAzl8Lcf4UJ+/uFXopfi6SaL55V61IdfIWCruI7O2Q=');
	});

	it('should opt-in PostHog via the loaded callback (overrides any persisted opt-out state)', () => {
		setSendAnalytics('TRUE');
		const mockProvider = vi.mocked(PostHogProvider);
		const posthog = spyOnPosthog();
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		const { lastCall } = mockProvider.mock;
		const options = lastCall?.[0].options as Partial<PostHogConfig> & {
			loaded?: (ph: PostHog) => void;
		};
		options.loaded?.(posthog as unknown as PostHog);
		expect(posthog.opt_in_capturing).toHaveBeenCalled();
	});

	it.each(['localhost', '127.0.0.1'])(
		'should not identify nor opt-in via the loaded callback if host is %s',
		(host) => {
			vi.spyOn(utils, 'getCurrentLocationHost').mockReturnValue(host);
			setSendAnalytics('TRUE');
			useAccountStore.setState({ account: mockedAccount });
			const mockProvider = vi.mocked(PostHogProvider);
			const posthog = spyOnPosthog();
			setup(
				<TrackerProvider>
					<div data-testid={'child'} />
				</TrackerProvider>
			);
			const { lastCall } = mockProvider.mock;
			const options = lastCall?.[0].options as Partial<PostHogConfig> & {
				loaded?: (ph: PostHog) => void;
			};
			options.loaded?.(posthog as unknown as PostHog);
			expect(posthog.identify).not.toHaveBeenCalled();
			expect(posthog.opt_in_capturing).not.toHaveBeenCalled();
		}
	);
});

describe('TrackerSetup', () => {
	it.each([true, false])(
		'should set is_ce person property to %s when CE state is known',
		(isCE) => {
			setSendAnalytics('TRUE');
			useLoginConfigStore.setState({ isCarbonioCE: isCE });
			const posthog = spyOnPosthog();
			Object.assign(posthog, { __loaded: true });
			setup(
				<TrackerProvider>
					<div data-testid={'child'} />
				</TrackerProvider>
			);
			expect(posthog.setPersonProperties).toHaveBeenCalledWith({ is_ce: isCE });
		}
	);

	it('should not set is_ce person property when CE state is undefined', () => {
		setSendAnalytics('TRUE');
		useLoginConfigStore.setState({ isCarbonioCE: undefined });
		const posthog = spyOnPosthog();
		Object.assign(posthog, { __loaded: true });
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(posthog.setPersonProperties).not.toHaveBeenCalled();
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
		expect(posthog.setPersonProperties).not.toHaveBeenCalled();
		expect(posthog.set_config).not.toHaveBeenCalled();
	});

	it('should enable surveys when Carbonio is CE', () => {
		setSendAnalytics('TRUE');
		useLoginConfigStore.setState({ isCarbonioCE: true });
		const posthog = spyOnPosthog();
		Object.assign(posthog, { __loaded: true });
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(posthog.set_config).toHaveBeenCalledWith({ disable_surveys: false });
	});

	it('should not call set_config when Carbonio is not CE (config already disables surveys)', () => {
		setSendAnalytics('TRUE');
		useLoginConfigStore.setState({ isCarbonioCE: false });
		const posthog = spyOnPosthog();
		Object.assign(posthog, { __loaded: true });
		vi.mocked(posthog.config)!.disable_surveys = true;
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(posthog.set_config).not.toHaveBeenCalled();
	});

	it('should re-apply config when CE state changes', () => {
		setSendAnalytics('TRUE');
		useLoginConfigStore.setState({ isCarbonioCE: false });
		const posthog = spyOnPosthog();
		Object.assign(posthog, { __loaded: true });
		vi.mocked(posthog.config)!.disable_surveys = true;
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(posthog.set_config).not.toHaveBeenCalled();
		act(() => {
			useLoginConfigStore.setState({ isCarbonioCE: true });
		});
		expect(posthog.set_config).toHaveBeenCalledWith({ disable_surveys: false });
	});

	it('should NOT run setup effects when carbonioPrefSendAnalytics is FALSE', () => {
		setSendAnalytics('FALSE');
		useLoginConfigStore.setState({ isCarbonioCE: true });
		const posthog = spyOnPosthog();
		Object.assign(posthog, { __loaded: true });
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(posthog.setPersonProperties).not.toHaveBeenCalled();
		expect(posthog.set_config).not.toHaveBeenCalled();
	});

	it.each([true, false])(
		'should set is_ce person property to %s via the loaded callback (initial setup post-init)',
		(isCE) => {
			setSendAnalytics('TRUE');
			useLoginConfigStore.setState({ isCarbonioCE: isCE });
			const mockProvider = vi.mocked(PostHogProvider);
			const posthog = spyOnPosthog();
			setup(
				<TrackerProvider>
					<div data-testid={'child'} />
				</TrackerProvider>
			);
			const { lastCall } = mockProvider.mock;
			const options = lastCall?.[0].options as Partial<PostHogConfig> & {
				loaded?: (ph: PostHog) => void;
			};
			options.loaded?.(posthog as unknown as PostHog);
			expect(posthog.setPersonProperties).toHaveBeenCalledWith({ is_ce: isCE });
			expect(posthog.set_config).toHaveBeenCalledWith({ disable_surveys: !isCE });
		}
	);

	it('should NOT apply CE state via the loaded callback when CE state is undefined', () => {
		setSendAnalytics('TRUE');
		useLoginConfigStore.setState({ isCarbonioCE: undefined });
		const mockProvider = vi.mocked(PostHogProvider);
		const posthog = spyOnPosthog();
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		const { lastCall } = mockProvider.mock;
		const options = lastCall?.[0].options as Partial<PostHogConfig> & {
			loaded?: (ph: PostHog) => void;
		};
		options.loaded?.(posthog as unknown as PostHog);
		expect(posthog.setPersonProperties).not.toHaveBeenCalled();
		expect(posthog.set_config).not.toHaveBeenCalled();
	});

	it('should opt-out PostHog when carbonioPrefSendAnalytics changes from TRUE to FALSE', () => {
		setSendAnalytics('TRUE');
		const posthog = spyOnPosthog();
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(posthog.opt_out_capturing).not.toHaveBeenCalled();
		act(() => {
			setSendAnalytics('FALSE');
		});
		expect(posthog.opt_out_capturing).toHaveBeenCalled();
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
		expect(posthog.opt_in_capturing).not.toHaveBeenCalled();
	});

	it('should explicitly opt-in PostHog when singleton is already loaded (toggle FALSE → TRUE in session)', () => {
		setSendAnalytics('TRUE');
		const posthog = spyOnPosthog();
		Object.assign(posthog, { __loaded: true });
		setup(
			<TrackerProvider>
				<div data-testid={'child'} />
			</TrackerProvider>
		);
		expect(posthog.opt_in_capturing).toHaveBeenCalled();
	});

	it.each(['localhost', '127.0.0.1'])(
		'should NOT opt-in via mount effect if host is %s (even when singleton is already loaded)',
		(host) => {
			vi.spyOn(utils, 'getCurrentLocationHost').mockReturnValue(host);
			setSendAnalytics('TRUE');
			const posthog = spyOnPosthog();
			Object.assign(posthog, { __loaded: true });
			setup(
				<TrackerProvider>
					<div data-testid={'child'} />
				</TrackerProvider>
			);
			expect(posthog.opt_in_capturing).not.toHaveBeenCalled();
		}
	);
});
