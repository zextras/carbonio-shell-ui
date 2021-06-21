/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import { Component, FunctionComponent } from 'react';

export type SharedAction = {
	id: string;
	label: string;
	icon: string | Component;
	types?: Array<string>;
	// eslint-disable-next-line @typescript-eslint/ban-types
	click: Function;
	disabled?: boolean;
	getDisabledStatus?: (...args: unknown[]) => boolean;
};

export type CoreAppData = {
	priority: number;
	package: string;
	name: string;
	description: string;
	version: string;
	resourceUrl: string;
	entryPoint: string;
};

export type UninitializedAppData = {
	core: CoreAppData;
};

export type RuntimeAppData = Partial<{
	icon: string | Component<{ active: boolean }>;
	views: {
		app?: Component | FunctionComponent;
		board?: Component | FunctionComponent;
		settings?: Component | FunctionComponent;
		sidebar?: Component | FunctionComponent;
	};
	context: unknown;
	search: {
		onSearch?: (query: string) => void;
		route?: string;
	};
	newButton: {
		primary: SharedAction;
		secondaryItems: Array<SharedAction>;
	};
}>;

export type AppData = UninitializedAppData & RuntimeAppData;

export type AppsMap = Record<string, AppData>;

export type IntegratedComponentsMap = Record<string, { app: string; item: Component }>;
// eslint-disable-next-line @typescript-eslint/ban-types
export type IntegratedHooksMap = Record<string, { app: string; item: Function }>;
// eslint-disable-next-line @typescript-eslint/ban-types
export type IntegratedFunctionsMap = Record<string, { app: string; item: Function }>;
export type IntegratedActionsMap = Record<string, { app: string; item: SharedAction }>;

export type Integrations = {
	components: IntegratedComponentsMap;
	hooks: IntegratedHooksMap;
	functions: IntegratedFunctionsMap;
	actions: IntegratedActionsMap;
};
export type IntegrationsRegister = {
	components: Record<string, Component>;
	// eslint-disable-next-line @typescript-eslint/ban-types
	hooks: Record<string, Function>;
	// eslint-disable-next-line @typescript-eslint/ban-types
	functions: Record<string, Function>;
	actions: Record<string, SharedAction>;
};

export type Setters = {
	addApps: (apps: Array<CoreAppData>) => void;
	registerAppData: (id: string) => (data: RuntimeAppData) => void;
	registerIntegrations: (id: string) => (data: IntegrationsRegister) => void;
	setAppContext: (id: string) => (data: unknown) => void;
};

export type AppState = {
	apps: AppsMap;
	integrations: Integrations;
	setters: Setters;
};
