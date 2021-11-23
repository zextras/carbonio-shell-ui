
import { Component, ComponentClass, FunctionComponent } from 'react';
import { ZextrasModule } from '../account';

export type UninitializedAppData = {
	core: ZextrasModule;
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
	addApps: (apps: Array<ZextrasModule>) => void;
	setAppClass: (id: string, component: ComponentClass) => void;
	registerAppData: (id: string) => (data: RuntimeAppData) => void;
	setAppContext: (id: string) => (data: unknown) => void;
};

export type AppState = {
	apps: AppsMap;
	setters: Setters;
	shell?: ZextrasModule;
};
