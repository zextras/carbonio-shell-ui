/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { act, renderHook } from '@testing-library/react';
import type { CaptureOptions } from 'posthog-js';

import { useTracker } from './tracker';
import { useAccountStore } from '../store/account';
import { mockedAccount } from '../tests/account-utils';
import { spyOnPosthog } from '../tests/posthog-utils';
import * as utils from '../utils/utils';

beforeEach(() => {
	vi.spyOn(utils, 'getCurrentLocationHost').mockReturnValue('differentHost');
});

describe('useTracker', () => {
	it('should opt-in posthog if host is not localhost and enableTracker is called with true value', () => {
		const posthog = spyOnPosthog();
		const { result } = renderHook(() => useTracker());
		act(() => {
			result.current.enableTracker(true);
		});
		expect(
			posthog.opt_in_capturing,
			'enableTracker(true) should opt in PostHog when host is not localhost'
		).toHaveBeenCalled();
	});

	it.each(['localhost', '127.0.0.1'])('should not opt-in posthog if host is %s', (host) => {
		vi.spyOn(utils, 'getCurrentLocationHost').mockReturnValue(host);
		const posthog = spyOnPosthog();
		const { result } = renderHook(() => useTracker());
		result.current.enableTracker(true);
		expect(
			posthog.opt_in_capturing,
			`enableTracker(true) should not opt in PostHog when host is ${host}`
		).not.toHaveBeenCalled();
	});

	it('should opt-out posthog if enableTracker is called with false value', () => {
		const posthog = spyOnPosthog();
		const { result } = renderHook(() => useTracker());
		act(() => {
			result.current.enableTracker(false);
		});
		expect(
			posthog.opt_out_capturing,
			'enableTracker(false) should opt out PostHog'
		).toHaveBeenCalled();
	});

	it('should reset posthog if reset function is called', () => {
		const posthog = spyOnPosthog();
		const { result } = renderHook(() => useTracker());
		result.current.reset();
		expect(posthog.reset, 'reset() should reset PostHog').toHaveBeenCalled();
	});

	it('should call capture ', () => {
		const posthog = spyOnPosthog();
		const { result } = renderHook(() => useTracker());
		const eventName = 'event name';
		const properties = { prop1: 'prop1value', prop2: 'prop2value' };
		const options: CaptureOptions = { send_instantly: true };
		result.current.capture(eventName, properties, options);
		expect(
			posthog.capture,
			'capture() should forward the event name, properties and options to PostHog'
		).toHaveBeenCalledWith(eventName, properties, options);
	});

	it('should identify user through its hashed id when enabling the tracker for an authenticated account', async () => {
		useAccountStore.setState({ account: mockedAccount });
		const posthog = spyOnPosthog();
		const { result } = renderHook(() => useTracker());
		act(() => {
			result.current.enableTracker(true);
		});
		await vi.advanceTimersByTimeAsync(0);
		expect(
			posthog.identify,
			'enableTracker should identify the authenticated user via their hashed id'
		).toHaveBeenCalledWith('mEAzl8Lcf4UJ+/uFXopfi6SaL55V61IdfIWCruI7O2Q=');
	});

	it('should not identify user if no user is authenticated', () => {
		useAccountStore.setState({ account: undefined });
		const posthog = spyOnPosthog();
		const { result } = renderHook(() => useTracker());
		act(() => {
			result.current.enableTracker(true);
		});
		expect(
			posthog.identify,
			'enableTracker should not identify the user when no account is authenticated'
		).not.toHaveBeenCalled();
	});
});
