import { Store } from '@reduxjs/toolkit';
import { Component } from 'react';

export type SharedAction = {
	id: string;
	label: string;
	icon: string | Component;
	types: Array<string>;
	// eslint-disable-next-line @typescript-eslint/ban-types
	click: Function;
	validator: (...args: unknown[]) => boolean;
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

export type UninitializedApp = {
	core: CoreAppData;
	redux?: Store;
};

export type AppData = UninitializedApp &
	Partial<{
		icon: string | Component<{ active: boolean }>;
		views: {
			app: Component;
			board: Component;
			settings: Component;
			sidebar: Component;
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
	registerAppData: (id: string) => (data: Partial<Omit<AppData, 'core'>>) => void;
	registerIntegrations: (id: string) => (data: IntegrationsRegister) => void;
};

export type AppState = {
	apps: AppsMap;
	integrations: Integrations;
	setters: Setters;
};
