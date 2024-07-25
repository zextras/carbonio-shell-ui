/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useEffect } from 'react';

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
	const integrationFunctions = useIntegrationsStore((s) => s.functions);
	const addSettingsViewFn = integrationFunctions['add-settings-view'];
	const removeSettingsViewFn = integrationFunctions['remove-settings-view'];
	const addAppFn = integrationFunctions['add-app'];
	const removeAppFn = integrationFunctions['remove-app'];

	useEffect(() => {
		if (addSettingsViewFn) {
			invokeFn(addSettingsViewFn, settingViewsToAdd);
		}
	}, [addSettingsViewFn]);

	useEffect(() => {
		if (removeSettingsViewFn) {
			invokeFn(removeSettingsViewFn, settingViewsToRemove);
		}
	}, [removeSettingsViewFn]);

	useEffect(() => {
		if (addAppFn) {
			invokeFn(addAppFn, appsToAdd);
		}
	}, [addAppFn]);

	useEffect(() => {
		if (removeAppFn) {
			invokeFn(removeAppFn, appsToRemove);
		}
	}, [removeAppFn]);
};
