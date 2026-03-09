/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import type { PostHogConfig } from 'posthog-js';
import type * as PostHogReact from 'posthog-js/react';

const postHog = {
	opt_in_capturing: vi.fn(),
	opt_out_capturing: vi.fn(),
	reset: vi.fn(),
	identify: vi.fn(),
	has_opted_in_capturing: vi.fn().mockReturnValue(false),
	setPersonProperties: vi.fn(),
	set_config: vi.fn(),
	config: {
		opt_out_capturing_by_default: true,
		disable_session_recording: true,
		disable_surveys: true
	} as PostHogConfig,
	capture: vi.fn()
} satisfies Partial<ReturnType<(typeof PostHogReact)['usePostHog']>>;

export const usePostHog: (typeof PostHogReact)['usePostHog'] = vi
	.fn()
	.mockReturnValue(postHog as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>);

export const PostHogProvider = vi
	.fn()
	.mockImplementation(
		({
			children
		}: React.ComponentPropsWithoutRef<
			(typeof PostHogReact)['PostHogProvider']
		>): React.JSX.Element => <>{children}</>
	);
