/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';
import { vi } from 'vitest';

import * as posthogJsReact from 'posthog-js/react';
import { vi } from 'vitest';
import type * as PostHogReact from 'posthog-js/react';
import { vi } from 'vitest';

import { TrackerProvider } from './provider';
import { vi } from 'vitest';
import { setup } from '../tests/utils';
import { vi } from 'vitest';
import * as utils from '../utils/utils';
import { vi } from 'vitest';

beforeEach(() => {
	vi.spyOn(utils, 'getCurrentLocationHost').mockReturnValue('differentHost');
});

describe('TrackerProvider', () => {
	it('should invoke tracker provider with trackers disabled by default', () => {
		const mockProvider = vi.spyOn(posthogJsReact, 'PostHogProvider');
		setup(<TrackerProvider />);
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
	});
});
