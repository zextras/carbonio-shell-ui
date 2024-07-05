/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { renderHook } from '@testing-library/react-hooks';
import * as posthogJs from 'posthog-js/react';
import type * as PostHogReact from 'posthog-js/react';

import { TrackerProvider, useTracker } from './posthog';
import { setup } from '../tests/utils';
import * as posthog from '../utils/utils';

describe('Posthog', () => {
	it('should opt-in posthog if it not on localhost and enableTracker is called with true value', () => {
		jest.spyOn(posthog, 'getCurrentLocationHost').mockReturnValue('differentHost');
		const optInCapturingFn = jest.fn();
		jest.spyOn(posthogJs, 'usePostHog').mockReturnValue({
			opt_in_capturing: optInCapturingFn
		} as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>);
		const { result } = renderHook(() => useTracker());
		result.current.enableTracker(true);
		expect(optInCapturingFn).toHaveBeenCalled();
	});

	it.each(['localhost', '127.0.0.1'])('should not opt-in posthog it is on %s', (host) => {
		jest.spyOn(posthog, 'getCurrentLocationHost').mockReturnValue(host);
		const optInCapturingFn = jest.fn();
		jest.spyOn(posthogJs, 'usePostHog').mockReturnValue({
			opt_in_capturing: optInCapturingFn
		} as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>);
		const { result } = renderHook(() => useTracker());
		result.current.enableTracker(true);
		expect(optInCapturingFn).not.toHaveBeenCalled();
	});

	it('should opt-out posthog if enableTracker is called with false value', () => {
		jest.spyOn(posthog, 'getCurrentLocationHost').mockReturnValue('differentHost');
		const optOutCapturingFn = jest.fn();
		jest.spyOn(posthogJs, 'usePostHog').mockReturnValue({
			opt_out_capturing: optOutCapturingFn
		} as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>);
		const { result } = renderHook(() => useTracker());
		result.current.enableTracker(false);
		expect(optOutCapturingFn).toHaveBeenCalled();
	});

	it('should reset posthog if reset function is called', () => {
		const resetFn = jest.fn();
		jest.spyOn(posthogJs, 'usePostHog').mockReturnValue({
			reset: resetFn
		} as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>);
		const { result } = renderHook(() => useTracker());
		result.current.reset();
		expect(resetFn).toHaveBeenCalled();
	});

	it('should invoke posthog provider with trackers disabled by default', () => {
		const mockProvider = jest.spyOn(posthogJs, 'PostHogProvider');
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
});
