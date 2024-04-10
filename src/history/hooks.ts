/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMemo, useCallback } from 'react';

import { To } from 'history';
import { find, startsWith, replace, trim } from 'lodash';
import { useLocation, useHistory } from 'react-router-dom';

import { AppRoute, HistoryParams } from '../../types';
import { SEARCH_APP_ID } from '../constants';
import { useSearchStore } from '../search/search-store';
import { useRoutes, getRoutes } from '../store/app';
import { useContextBridge } from '../store/context-bridge';

export const useCurrentRoute = (): AppRoute | undefined => {
	const location = useLocation();
	const routes = useRoutes();
	return useMemo(
		() => find(routes, ({ route }) => startsWith(trim(location.pathname, '/'), route)),
		[location.pathname, routes]
	);
};
export const getCurrentRoute = (): AppRoute | undefined => {
	const history = useContextBridge.getState().functions.getHistory?.();
	const routes = getRoutes();
	const route = find(routes, (r) => startsWith(trim(history.location.pathname, '/'), r.route));
	if (route?.route === SEARCH_APP_ID) {
		return {
			...route,
			route: `${route.route}/${useSearchStore.getState().module}`
		};
	}
	return route;
};

export const parseParams = (params: HistoryParams): To => {
	if (typeof params === 'string') {
		return replace(`/${getCurrentRoute()?.route}/${params}`, '//', '/');
	}
	const routeToApply = params.route
		? find(getRoutes(), (r) => r.id === params.route || r.route === params.route)
		: getCurrentRoute();
	return typeof params.path === 'string'
		? replace(`/${routeToApply?.route}/${params.path}`, '//', '/')
		: {
				search: params.path.search,
				hash: params.path.hash,
				pathname: replace(`/${routeToApply?.route}/${params.path.pathname}`, '//', '/')
			};
};

export const usePushHistoryCallback = (): ((params: HistoryParams) => void) => {
	const history = useHistory();
	return useCallback((params: HistoryParams): void => history.push(parseParams(params)), [history]);
};

export const useReplaceHistoryCallback = (): ((params: HistoryParams) => void) => {
	const history = useHistory();
	return useCallback(
		(params: HistoryParams): void => history.replace(parseParams(params)),
		[history]
	);
};

export function useGoBackHistoryCallback(): () => void {
	const history = useHistory();
	return history.goBack;
}

export const pushHistory = (params: HistoryParams): void => {
	const history = useContextBridge.getState().functions.getHistory?.();
	history.push(parseParams(params));
};

export const replaceHistory = (params: HistoryParams): void => {
	const history = useContextBridge.getState().functions.getHistory?.();
	history.replace(parseParams(params));
};

export const goBackHistory = (): void =>
	useContextBridge.getState().functions.getHistory?.().goBack();
