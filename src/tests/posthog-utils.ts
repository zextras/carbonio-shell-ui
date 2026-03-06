/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { PostHogConfig } from 'posthog-js';
import type * as PostHogReact from 'posthog-js/react';
import { usePostHog } from 'posthog-js/react';

export const spyOnPosthog = (): Partial<ReturnType<(typeof PostHogReact)['usePostHog']>> => {
	const postHog = {
		identify: vi.fn(),
		opt_in_capturing: vi.fn(),
		opt_out_capturing: vi.fn(),
		set_config: vi.fn(),
		has_opted_in_capturing: vi.fn(),
		config: {
			opt_out_capturing_by_default: true,
			disable_session_recording: true,
			disable_surveys: true
		} as PostHogConfig,
		reset: vi.fn(),
		setPersonProperties: vi.fn(),
		capture: vi.fn()
	} satisfies Partial<ReturnType<(typeof PostHogReact)['usePostHog']>>;
	vi.mocked(usePostHog).mockReturnValue(
		postHog as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>
	);
	return postHog;
};
