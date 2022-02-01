/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { find, startsWith, replace, trim } from 'lodash';
import { useMemo, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { AppRoute } from '../../types';
import { useRoutes, getRoutes } from '../store/app';
import { useContextBridge } from '../store/context-bridge';

export const useCurrentRoute = (): AppRoute | undefined => {
	const location = useLocation();
	const routes = useRoutes();
	return useMemo(
		() => find(routes, (r) => startsWith(trim(location.pathname, '/'), r.route)),
		[location.pathname, routes]
	);
};

export const usePushHistoryCallback = (prefix?: string): ((path?: string) => void) => {
	const history = useHistory();
	const cb = useCallback(
		(path?: string): void => history.push(replace(`/${prefix}/${path}`, '//', '/')),
		[history, prefix]
	);
	return cb;
};

export function useGoBackHistoryCallback(): () => void {
	const history = useHistory();
	return history.goBack;
}

export const useReplaceHistoryCallback = (prefix?: string): ((path?: string) => void) => {
	const history = useHistory();
	const cb = useCallback(
		(path?: string): void => history.replace(replace(`/${prefix}/${path}`, '//', '/')),
		[history, prefix]
	);
	return cb;
};

export const getCurrentRoute = (): AppRoute | undefined => {
	const history = useContextBridge.getState().functions.getHistory?.();
	const routes = getRoutes();
	return find(routes, (r) => startsWith(trim(history.location.pathname, '/'), r.route));
};

export const getPushHistoryCallback = (prefix?: string): ((path?: string) => void) => {
	const history = useContextBridge.getState().functions.getHistory?.();
	return (path?: string): void => history.push(replace(`/${prefix}/${path}`, '//', '/'));
};

export function getGoBackHistoryCallback(): () => void {
	return useContextBridge.getState().functions.getHistory?.().goBack;
}

export const getReplaceHistoryCallback = (prefix?: string): ((path?: string) => void) => {
	const history = useContextBridge.getState().functions.getHistory?.();
	return (path?: string): void => history.replace(replace(`/${prefix}/${path}`, '//', '/'));
};
