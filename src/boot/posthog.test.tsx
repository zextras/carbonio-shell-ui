/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import * as posthogJsReact from 'posthog-js/react';
import type * as PostHogReact from 'posthog-js/react';

import { TrackerProvider, useTracker } from './posthog';
import { useAccountStore } from '../store/account';
import { useLoginConfigStore } from '../store/login/store';
import { mockedAccount } from '../tests/account-utils';
import { spyOnPosthog } from '../tests/posthog-utils';
import { setup } from '../tests/utils';
import * as utils from '../utils/utils';

beforeEach(() => {
	jest.spyOn(utils, 'getCurrentLocationHost').mockReturnValue('differentHost');
});

describe('Posthog', () => {
	it('should opt-in posthog if it not on localhost and enableTracker is called with true value', () => {
		const posthog = spyOnPosthog();
		const { result } = renderHook(() => useTracker());
		act(() => {
			result.current.enableTracker(true);
		});
		expect(posthog.opt_in_capturing).toHaveBeenCalled();
	});

	it.each(['localhost', '127.0.0.1'])('should not opt-in posthog it is on %s', (host) => {
		jest.spyOn(utils, 'getCurrentLocationHost').mockReturnValue(host);
		const posthog = spyOnPosthog();
		const { result } = renderHook(() => useTracker());
		result.current.enableTracker(true);
		expect(posthog.opt_in_capturing).not.toHaveBeenCalled();
	});

	it('should opt-out posthog if enableTracker is called with false value', () => {
		const posthog = spyOnPosthog();
		const { result } = renderHook(() => useTracker());
		act(() => {
			result.current.enableTracker(false);
		});
		expect(posthog.opt_out_capturing).toHaveBeenCalled();
	});

	it('should reset posthog if reset function is called', () => {
		const posthog = spyOnPosthog();
		const { result } = renderHook(() => useTracker());
		result.current.reset();
		expect(posthog.reset).toHaveBeenCalled();
	});

	it('should invoke posthog provider with trackers disabled by default', () => {
		const mockProvider = jest.spyOn(posthogJsReact, 'PostHogProvider');
		setup(<TrackerProvider></TrackerProvider>);
		type PostHogProviderProps = React.ComponentPropsWithoutRef<
			(typeof PostHogReact)['PostHogProvider']
		>;
		expect(mockProvider).toHaveBeenLastCalledWith(
			expect.objectContaining<PostHogProviderProps>({
				options: expect.objectContaining<NonNullable<PostHogProviderProps['options']>>({
					opt_out_capturing_by_default: true,
					disable_session_recording: true,
					disable_surveys: true
				})
			}),
			expect.anything()
		);
	});

	it('should enable surveys if user is opted in and Carbonio is CE', () => {
		useLoginConfigStore.setState({ isCarbonioCE: true });
		const posthog = spyOnPosthog();
		jest.mocked(posthog.has_opted_in_capturing)?.mockReturnValue(true);
		const { result } = renderHook(() => useTracker());
		result.current.enableTracker(true);
		expect(posthog.set_config).toHaveBeenCalledWith({ disable_surveys: false });
	});

	it('should not enable surveys if the user is not opted in and Carbonio is CE', () => {
		useLoginConfigStore.setState({ isCarbonioCE: true });
		const posthog = spyOnPosthog();
		renderHook(() => useTracker());
		expect(posthog.set_config).not.toHaveBeenCalled();
	});

	it('should not enable surveys if the user is opted in and it is not Carbonio CE', () => {
		useLoginConfigStore.setState({ isCarbonioCE: false });
		const posthog = spyOnPosthog();
		renderHook(() => useTracker());
		expect(posthog.set_config).not.toHaveBeenCalled();
	});

	it('should not call set config again if it is already called with the same values', () => {
		useLoginConfigStore.setState({ isCarbonioCE: true });
		const posthog = spyOnPosthog();
		jest.mocked(posthog.has_opted_in_capturing)?.mockReturnValue(true);
		renderHook(() => useTracker());
		expect(posthog.set_config).toHaveBeenCalledWith({ disable_surveys: false });
		jest.mocked(posthog.config)!.disable_surveys = false;
		renderHook(() => useTracker());
		expect(posthog.set_config).toHaveBeenCalledTimes(1);
	});

	it('should call set config if Carbonio CE changes after the user is opted in', () => {
		useLoginConfigStore.setState({ isCarbonioCE: false });
		const posthog = spyOnPosthog();
		jest.mocked(posthog.has_opted_in_capturing)?.mockReturnValue(true);
		renderHook(() => useTracker());
		expect(posthog.set_config).not.toHaveBeenCalled();
		act(() => {
			useLoginConfigStore.setState({ isCarbonioCE: true });
		});
		expect(posthog.set_config).toHaveBeenCalled();
	});

	it('should call set config if the user opts in after Carbonio CE changes', () => {
		useLoginConfigStore.setState({ isCarbonioCE: true });
		const posthog = spyOnPosthog();
		jest.mocked(posthog.has_opted_in_capturing)?.mockReturnValue(false);
		const { result } = renderHook(() => useTracker());
		expect(posthog.set_config).not.toHaveBeenCalled();
		jest.mocked(posthog.has_opted_in_capturing)?.mockReturnValue(true);
		act(() => {
			result.current.enableTracker(true);
		});
		expect(posthog.set_config).toHaveBeenCalled();
	});

	it('should identify user through its hashed id if it is authenticated', async () => {
		useAccountStore.setState({ account: mockedAccount });
		const posthog = spyOnPosthog();
		const { result } = renderHook(() => useTracker());
		act(() => {
			result.current.enableTracker(true);
		});
		await waitFor(() =>
			expect(posthog.identify).toHaveBeenCalledWith('mEAzl8Lcf4UJ+/uFXopfi6SaL55V61IdfIWCruI7O2Q=')
		);
	});

	it('should not identify user if no user is authenticated', () => {
		useAccountStore.setState({ account: undefined });
		const posthog = spyOnPosthog();
		const { result } = renderHook(() => useTracker());
		act(() => {
			result.current.enableTracker(true);
		});
		expect(posthog.identify).not.toHaveBeenCalled();
	});

	it('should disable surveys if the user opts out', () => {
		useLoginConfigStore.setState({ isCarbonioCE: true });
		const posthog = spyOnPosthog();
		jest.mocked(posthog.has_opted_in_capturing)?.mockReturnValue(true);
		jest.mocked(posthog.config)!.disable_surveys = false;
		const { result } = renderHook(() => useTracker());
		act(() => {
			result.current.enableTracker(false);
		});
		expect(posthog.set_config).toHaveBeenLastCalledWith({ disable_surveys: true });
	});

	it.each([true, false])('should set person properties is_ce if is Carbonio CE %s', (isCE) => {
		useLoginConfigStore.setState({ isCarbonioCE: isCE });
		const posthog = spyOnPosthog();
		renderHook(() => useTracker());
		expect(posthog.setPersonProperties).toHaveBeenCalledWith({ is_ce: isCE });
	});

	it('should set person properties is_ce if is carbonio CE is undefined', () => {
		useLoginConfigStore.setState({ isCarbonioCE: undefined });
		const posthog = spyOnPosthog();
		renderHook(() => useTracker());
		expect(posthog.setPersonProperties).not.toHaveBeenCalled();
	});
});
