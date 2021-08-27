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
import { Component, ComponentClass, FunctionComponent } from 'react';

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
	class?: Component;
};

export type RuntimeAppData = Partial<{
	icon: string | Component<{ active: boolean }>;
	views: {
		app?: Component | FunctionComponent;
		board?: Component | FunctionComponent;
		settings?: Component | FunctionComponent;
		search?: Component | FunctionComponent;
		sidebar?: Component | FunctionComponent;
		teambar?: {
			icon: Component | FunctionComponent;
			sidebar: Component | FunctionComponent;
		};
	};
	context: unknown;
}>;
export type AppData = UninitializedAppData & RuntimeAppData;

export type AppsMap = Record<string, AppData>;

export type Setters = {
	addApps: (apps: Array<CoreAppData>) => void;
	setAppClass: (id: string, component: ComponentClass) => void;
	registerAppData: (id: string) => (data: RuntimeAppData) => void;
	setAppContext: (id: string) => (data: unknown) => void;
};

export type AppState = {
	apps: AppsMap;
	setters: Setters;
};
