/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ComponentType } from 'react';
import { DropdownItem } from '@zextras/carbonio-design-system';

export type IntegrationsState = {
	actions: ActionMap;
	components: ComponentMap;
	functions: FunctionMap;
	removeActions: (...ids: Array<string>) => void;
	registerActions: (
		...items: Array<{ id: string; action: ActionFactory<unknown>; type: string }>
	) => void;
	removeComponents: (...ids: Array<string>) => void;
	registerComponents: (
		app: string
	) => (...items: Array<{ id: string; component: ComponentType }>) => void;
	removeFunctions: (...ids: Array<string>) => void;
	registerFunctions: (...items: Array<{ id: string; fn: AnyFunction }>) => void;
};

export type Action = DropdownItem & {
	primary?: boolean;
	group?: string;
	/** @deprecated use onClick instead */
	click?: DropdownItem['onClick'];
};

export type ActionFactory<T> = (target: T) => Action;
export type CombinedActionFactory<T> = (target: T) => Array<Action>;

export type ActionMap = Record<string, Record<string, ActionFactory<unknown>>>;
export type ComponentMap = Record<string, { app: string; item: ComponentType<any> }>;
export type FunctionMap = Record<string, AnyFunction>;

export type AnyFunction = (...args: unknown[]) => unknown;
