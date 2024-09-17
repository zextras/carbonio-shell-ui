/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { PostHogConfig } from 'posthog-js';
import type * as PostHogReact from 'posthog-js/react';
import * as posthogJsReact from 'posthog-js/react';

export const spyOnPosthog = (): Partial<ReturnType<(typeof PostHogReact)['usePostHog']>> => {
	const postHog = {
		identify: jest.fn(),
		opt_in_capturing: jest.fn(),
		opt_out_capturing: jest.fn(),
		set_config: jest.fn(),
		has_opted_in_capturing: jest.fn(),
		config: {
			opt_out_capturing_by_default: true,
			disable_session_recording: true,
			disable_surveys: true
		} as PostHogConfig,
		reset: jest.fn(),
		setPersonProperties: jest.fn(),
		capture: jest.fn()
	} satisfies Partial<ReturnType<(typeof PostHogReact)['usePostHog']>>;
	jest
		.spyOn(posthogJsReact, 'usePostHog')
		.mockReturnValue(postHog as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>);
	return postHog;
};
