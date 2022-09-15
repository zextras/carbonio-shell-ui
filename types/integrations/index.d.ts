/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ComponentType, MouseEvent, SyntheticEvent } from 'react';

export type IntegrationsState = {
	actions: ActionMap;
	components: ComponentMap;
	hooks: HookMap;
	functions: FunctionMap;
	removeActions: (...ids: Array<string>) => void;
	registerActions: (
		...items: Array<{ id: string; action: ActionFactory<unknown>; type: string }>
	) => void;
	removeComponents: (...ids: Array<string>) => void;
	registerComponents: (
		app: string
	) => (...items: Array<{ id: string; component: ComponentType }>) => void;
	removeHooks: (...ids: Array<string>) => void;
	registerHooks: (...items: Array<{ id: string; hook: AnyFunction }>) => void;
	removeFunctions: (...ids: Array<string>) => void;
	registerFunctions: (...items: Array<{ id: string; fn: AnyFunction }>) => void;
};

export type Action = {
	id: string;
	label: string;
	icon: string;
	click: (ev: SyntheticEvent<HTMLElement> | KeyboardEvent) => void;
	type: 'divider';
	primary?: boolean;
	group?: string;
	disabled?: boolean;
	[key: string]: unknown;
};

export type ActionFactory<T> = (target: T) => Action;
export type CombinedActionFactory<T> = (target: T) => Array<Action>;

export type ActionMap = Record<string, Record<string, ActionFactory<unknown>>>;
export type ComponentMap = Record<string, { app: string; item: ComponentType<any> }>;
export type HookMap = Record<string, AnyFunction>;
export type FunctionMap = Record<string, AnyFunction>;

export type AnyFunction = (...args: unknown[]) => unknown;
