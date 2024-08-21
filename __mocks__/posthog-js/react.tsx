/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import type { PostHogConfig } from 'posthog-js';
import type * as PostHogReact from 'posthog-js/react';

const postHog = {
	opt_in_capturing: (): void => undefined,
	opt_out_capturing: (): void => undefined,
	reset: (): void => undefined,
	identify: (): void => undefined,
	has_opted_in_capturing: (): boolean => false,
	setPersonProperties: (): void => undefined,
	set_config: (): void => undefined,
	config: {} as PostHogConfig
} satisfies Partial<ReturnType<(typeof PostHogReact)['usePostHog']>>;

export const usePostHog: (typeof PostHogReact)['usePostHog'] = () =>
	postHog as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>;

export const PostHogProvider = ({
	children
}: React.ComponentPropsWithoutRef<(typeof PostHogReact)['PostHogProvider']>): React.JSX.Element => (
	<>{children}</>
);
