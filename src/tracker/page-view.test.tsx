/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';
import { vi } from 'vitest';

import { Link } from 'react-router-dom';
import { vi } from 'vitest';

import { TrackerPageView } from './page-view';
import { vi } from 'vitest';
import * as useTracker from './tracker';
import { vi } from 'vitest';
import type { Tracker } from './tracker';
import { vi } from 'vitest';
import { screen, setup } from '../tests/utils';
import { vi } from 'vitest';

describe('TrackerPageView', () => {
	it('should capture pageview event when pathname change', async () => {
		const tracker: Tracker = {
			capture: vi.fn(),
			enableTracker: vi.fn(),
			reset: vi.fn()
		};
		vi.spyOn(useTracker, 'useTracker').mockReturnValue(tracker);
		const { user } = setup(
			<>
				<TrackerPageView />
				<Link to={'/different-path'}>Go to different path</Link>
			</>,
			{ initialRouterEntries: ['/initial-path'] }
		);
		await user.click(screen.getByRole('link'));
		expect(tracker.capture).toHaveBeenLastCalledWith('$pageview', {
			$current_url: `${window.origin}/different-path`
		});
	});

	it('should capture pageview event when search params change', async () => {
		const tracker: Tracker = {
			capture: vi.fn(),
			enableTracker: vi.fn(),
			reset: vi.fn()
		};
		vi.spyOn(useTracker, 'useTracker').mockReturnValue(tracker);
		const { user } = setup(
			<>
				<TrackerPageView />
				<Link to={'/initial-path?param=2'}>Go to different path</Link>
			</>,
			{ initialRouterEntries: ['/initial-path?param=1'] }
		);
		await user.click(screen.getByRole('link'));
		expect(tracker.capture).toHaveBeenLastCalledWith('$pageview', {
			$current_url: `${window.origin}/initial-path?param=2`
		});
	});
});
