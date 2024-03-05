/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMemo } from 'react';

import { filter, intersection, omit } from 'lodash';

import type {
	AppRoute,
	PrimaryAccessoryView,
	SecondaryAccessoryView,
	UtilityView
} from '../../types';
import { useCurrentRoute } from '../history/hooks';
import { useAppStore } from '../store/app';

export const checkList = (l1: Array<string>, l2?: Array<string>): boolean =>
	intersection(l1, l2).length > 0;

export const checkRoute = (
	view: UtilityView | PrimaryAccessoryView | SecondaryAccessoryView,
	activeRoute?: AppRoute
): boolean => {
	const activeRouteValues = Object.values(omit(activeRoute, 'focusMode') ?? {});
	if (view.blacklistRoutes) return !checkList(activeRouteValues, view.blacklistRoutes);
	if (view.whitelistRoutes) return checkList(activeRouteValues, view.whitelistRoutes);
	return true;
};
export const useUtilityViews = (): Array<UtilityView> => {
	const utilityViews = useAppStore((s) => s.views.utilityBar);

	const activeRoute = useCurrentRoute();
	return useMemo(
		() => filter(utilityViews, (v) => checkRoute(v, activeRoute)),
		[activeRoute, utilityViews]
	);
};
