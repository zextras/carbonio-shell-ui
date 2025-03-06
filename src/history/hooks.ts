/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMemo } from 'react';

import { find, startsWith, trim } from 'lodash';
import { useLocation } from 'react-router-dom';

import { useRoutes } from '../store/app';
import type { AppRoute } from '../types/apps';

export const useCurrentRoute = (): AppRoute | undefined => {
	const location = useLocation();
	const routes = useRoutes();
	return useMemo(
		() => find(routes, ({ route }) => startsWith(trim(location.pathname, '/'), route)),
		[location.pathname, routes]
	);
};
