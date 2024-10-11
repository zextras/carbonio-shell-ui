/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import * as posthogJsReact from 'posthog-js/react';
import type * as PostHogReact from 'posthog-js/react';

import { TrackerProvider } from './provider';
import { setup } from '../tests/utils';
import * as utils from '../utils/utils';

beforeEach(() => {
	jest.spyOn(utils, 'getCurrentLocationHost').mockReturnValue('differentHost');
});

describe('TrackerProvider', () => {
	it('should invoke tracker provider with trackers disabled by default', () => {
		const mockProvider = jest.spyOn(posthogJsReact, 'PostHogProvider');
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
				})
			}),
			expect.anything()
		);
	});
});
