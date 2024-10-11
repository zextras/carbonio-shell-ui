/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { useTracker } from './tracker';

export const TrackerPageView = (): null => {
	const tracker = useTracker();
	const { pathname, search } = useLocation();
	useEffect(() => {
		tracker.capture('$pageview', {
			$current_url: window.origin + pathname + search
		});
	}, [pathname, search, tracker]);

	return null;
};
