/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import type * as PostHogReact from 'posthog-js/react';

export const usePostHog: (typeof PostHogReact)['usePostHog'] = () =>
	({
		opt_in_capturing: (): void => undefined,
		opt_out_capturing: (): void => undefined,
		reset: (): void => undefined
	}) as unknown as ReturnType<(typeof PostHogReact)['usePostHog']>;

export const PostHogProvider = ({
	children
}: React.ComponentPropsWithoutRef<(typeof PostHogReact)['PostHogProvider']>): React.JSX.Element => (
	<>{children}</>
);
