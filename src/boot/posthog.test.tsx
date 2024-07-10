/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import * as posthogJsReact from 'posthog-js/react';
import type * as PostHogReact from 'posthog-js/react';

import { TrackerProvider, useTracker } from './posthog';
import { useAccountStore } from '../store/account';
import { useLoginConfigStore } from '../store/login/store';
import { mockedAccount } from '../tests/account-utils';
import { setup } from '../tests/utils';
import * as utils from '../utils/utils';

describe('Posthog', () => {
	it('should opt-in posthog if it not on localhost and enableTracker is called with true value', () => {
		jest.spyOn(utils, 'getCurrentLocationHost').mockReturnValue('differentHost');
		const optInCapturingFn = jest.fn();
		jest.spyOn(posthogJsReact, 'usePostHog').mockReturnValue({
			opt_in_capturing: optInCapturingFn
		} as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>);
		const { result } = renderHook(() => useTracker());
		result.current.enableTracker(true);
		expect(optInCapturingFn).toHaveBeenCalled();
	});

	it.each(['localhost', '127.0.0.1'])('should not opt-in posthog it is on %s', (host) => {
		jest.spyOn(utils, 'getCurrentLocationHost').mockReturnValue(host);
		const optInCapturingFn = jest.fn();
		jest.spyOn(posthogJsReact, 'usePostHog').mockReturnValue({
			opt_in_capturing: optInCapturingFn
		} as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>);
		const { result } = renderHook(() => useTracker());
		result.current.enableTracker(true);
		expect(optInCapturingFn).not.toHaveBeenCalled();
	});

	it('should opt-out posthog if enableTracker is called with false value', () => {
		jest.spyOn(utils, 'getCurrentLocationHost').mockReturnValue('differentHost');
		const optOutCapturingFn = jest.fn();
		jest.spyOn(posthogJsReact, 'usePostHog').mockReturnValue({
			opt_out_capturing: optOutCapturingFn
		} as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>);
		const { result } = renderHook(() => useTracker());
		result.current.enableTracker(false);
		expect(optOutCapturingFn).toHaveBeenCalled();
	});

	it('should reset posthog if reset function is called', () => {
		const resetFn = jest.fn();
		jest.spyOn(posthogJsReact, 'usePostHog').mockReturnValue({
			reset: resetFn
		} as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>);
		const { result } = renderHook(() => useTracker());
		result.current.reset();
		expect(resetFn).toHaveBeenCalled();
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

	it('should enable surveys when enableTracker is called with true if carbonio is CE', () => {
		useLoginConfigStore.setState({ isCarbonioCE: true });
		jest.spyOn(utils, 'getCurrentLocationHost').mockReturnValue('differentHost');
		const setConfigFn = jest.fn();
		jest.spyOn(posthogJsReact, 'usePostHog').mockReturnValue({
			opt_in_capturing: jest.fn(),
			set_config: setConfigFn
		} as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>);
		const { result } = renderHook(() => useTracker());
		result.current.enableTracker(true);
		expect(setConfigFn).toHaveBeenCalledWith({ disable_surveys: false });
	});

	it('should leave surveys disabled when enableTracker is called with true and carbonio is not CE', () => {
		useLoginConfigStore.setState({ isCarbonioCE: false });
		jest.spyOn(utils, 'getCurrentLocationHost').mockReturnValue('differentHost');
		const setConfigFn = jest.fn();
		jest.spyOn(posthogJsReact, 'usePostHog').mockReturnValue({
			opt_in_capturing: jest.fn(),
			set_config: setConfigFn
		} as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>);
		const { result } = renderHook(() => useTracker());
		result.current.enableTracker(true);
		expect(setConfigFn).not.toHaveBeenCalled();
	});

	it('should identify user through its hashed id if authenticated', async () => {
		useAccountStore.setState({ account: mockedAccount });
		jest.spyOn(utils, 'getCurrentLocationHost').mockReturnValue('differentHost');
		const postHog = {
			identify: jest.fn(),
			opt_in_capturing: jest.fn()
		} satisfies Partial<ReturnType<(typeof PostHogReact)['usePostHog']>>;
		jest
			.spyOn(posthogJsReact, 'usePostHog')
			.mockReturnValue(postHog as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>);
		const { result } = renderHook(() => useTracker());
		result.current.enableTracker(true);
		await waitFor(() =>
			expect(postHog.identify).toHaveBeenCalledWith('mEAzl8Lcf4UJ+/uFXopfi6SaL55V61IdfIWCruI7O2Q=')
		);
	});

	it('should not identify user if no user is authenticated', () => {
		useAccountStore.setState({ account: undefined });
		jest.spyOn(utils, 'getCurrentLocationHost').mockReturnValue('differentHost');
		const postHog = {
			identify: jest.fn(),
			opt_in_capturing: jest.fn()
		} satisfies Partial<ReturnType<(typeof PostHogReact)['usePostHog']>>;
		jest
			.spyOn(posthogJsReact, 'usePostHog')
			.mockReturnValue(postHog as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>);
		const { result } = renderHook(() => useTracker());
		result.current.enableTracker(true);
		expect(postHog.identify).not.toHaveBeenCalled();
	});
});
