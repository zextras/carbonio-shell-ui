/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useEffect } from 'react';

import { useIntegratedFunction } from '../store/integrations/hooks';
import { useIntegrationsStore } from '../store/integrations/store';
import type { AnyFunction } from '../utils/typeUtils';

const integrationFunctionBridge = (key: string, queue: unknown[], data: unknown): void => {
	const fn = useIntegrationsStore.getState().functions[key];
	if (fn) {
		fn(data);
	} else {
		queue.push(data);
	}
};

const settingViewsToAdd: unknown[] = [];
export const addSettingsView = (view: unknown): void => {
	integrationFunctionBridge('add-settings-view', settingViewsToAdd, view);
};

const settingViewsToRemove: unknown[] = [];
export const removeSettingsView = (id: unknown): void => {
	integrationFunctionBridge('remove-settings-view', settingViewsToRemove, id);
};

const appsToAdd: unknown[] = [];
export const addApp = (view: unknown): void => {
	integrationFunctionBridge('add-app', appsToAdd, view);
};

const appsToRemove: unknown[] = [];
export const removeApp = (view: unknown): void => {
	integrationFunctionBridge('add-app', appsToAdd, view);
};

const invokeFn = (fn: AnyFunction, queue: unknown[]): void => {
	queue.forEach((data) => {
		fn(data);
	});
	queue.splice(0, queue.length);
};

export const useSettingsViewDeprecationBridge = (): void => {
	const [addSettingsViewFn, isAddSettingsViewFnAvailable] =
		useIntegratedFunction('add-settings-view');
	const [removeSettingsViewFn, isRemoveSettingsViewFnAvailable] =
		useIntegratedFunction('remove-settings-view');
	const [addAppFn, isAddAppFnAvailable] = useIntegratedFunction('add-app');
	const [removeAppFn, isRemoveAppFnAvailable] = useIntegratedFunction('remove-app');

	useEffect(() => {
		if (isAddSettingsViewFnAvailable) {
			invokeFn(addSettingsViewFn, settingViewsToAdd);
		}
	}, [addSettingsViewFn, isAddSettingsViewFnAvailable]);

	useEffect(() => {
		if (isRemoveSettingsViewFnAvailable) {
			invokeFn(removeSettingsViewFn, settingViewsToRemove);
		}
	}, [isRemoveSettingsViewFnAvailable, removeSettingsViewFn]);

	useEffect(() => {
		if (isAddAppFnAvailable) {
			invokeFn(addAppFn, appsToAdd);
		}
	}, [addAppFn, isAddAppFnAvailable]);

	useEffect(() => {
		if (isRemoveAppFnAvailable) {
			invokeFn(removeAppFn, appsToRemove);
		}
	}, [isRemoveAppFnAvailable, removeAppFn]);
};
