/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ComponentType } from 'react';

export type CarbonioModule = {
	commit: string;
	description: string;
	// eslint-disable-next-line camelcase
	js_entrypoint: string;
	name: string;
	priority: number;
	version: string;
	type: 'app' | 'admin' | 'shell';
	attrKey: string;
	icon: string;
	displayName: string;
};

export type AppRoute = {
	// persist?: boolean;
	id: string;
	route: string;
	app: string;
};

export type AppRouteData = AppRoute & {
	primaryBar: PrimaryBarView;
	secondaryBar: SecondaryBarView;
	appView: AppView;
};

export type BadgeInfo = {
	show: boolean;
	count?: number;
	showCount?: boolean;
	color?: string;
};

export type CarbonioView<P> = {
	id: string;
	app: string;
	route: string;
	component: ComponentType<P>;
};

export type PrimaryBarView = Omit<CarbonioView<PrimaryBarComponentProps>, 'component'> & {
	component: string | ComponentType<PrimaryBarComponentProps>;
	badge: BadgeInfo;
	position: number;
	visible: boolean;
	label: string;
};

export type SecondaryBarView = CarbonioView<SecondaryBarComponentProps>;

export type AppView = CarbonioView<AppViewComponentProps>;

export type BoardView = CarbonioView<BoardViewComponentProps>;

export type UtilityView = CarbonioView<PrimaryBarComponentProps> & {
	button: string | ComponentType<PrimaryBarComponentProps>;
	badge: BadgeInfo;
	position: number;
	label: string;
};

export type SettingsView = CarbonioView<SettingsViewProps>;

export type SearchView = CarbonioView<SearchViewProps>;

export type PrimaryAccessoryView = CarbonioView<PrimaryAccessoryViewProps>;

export type SecondaryAccessoryView = CarbonioView<SecondaryAccessoryViewProps>;

export type AppSetters = {
	addApps: (apps: Array<Partial<CarbonioModule>>) => void;
	// add route (id route primaryBar secondaryBar app)
	addRoute: (routeData: AppRouteData) => string;
	setRouteVisibility: (id: string, visible: boolean) => void;
	// remove route (id | route)
	removeRoute: (id: string) => void;
	//
	// update primaryBar
	updatePrimaryBadge: (id: string, badge: BadgeInfo) => void;
	//
	// add board
	addBoardView: (id: string, data: BoardView) => string;
	// remove board
	removeBoardView: (id: string) => void;
	//
	// add settings
	addSettingsView: (id: string, data: SettingsView) => string;
	// remove settings
	removeSettingsView: (id: string) => void;
	//
	// add search
	addSearchView: (id: string, data: SearchView) => string;
	// remove search
	removeSearchView: (id: string) => void;
	//
	// add utility
	addUtilityView: (id: string, data: UtilityView) => string;
	// remove utility
	removeUtilityView: (id: string) => void;
	//
	// add primaryAccessory
	addPrimaryAccessoryView: (id: string, data: PrimaryAccessoryView) => string;
	// remove primaryAccessory
	removePrimaryAccessoryView: (id: string) => void;
	//
	// add secondaryAccessory
	addSecondaryAccessoryView: (id: string, data: SecondaryAccessoryView) => string;
	// remove secondaryAccessory
	removeSecondaryAccessoryView: (id: string) => void;
	setAppContext: (app: string) => (context: unknown) => void;
};
export type AppState = {
	apps: Record<string, CarbonioModule>;
	appContexts: Record<string, unknown>;
	entryPoints: Record<string, ComponentType>;
	routes: Record<string, AppRoute>;
	views: {
		primaryBar: Array<PrimaryBarView>;
		secondaryBar: Array<SecondaryBarView>;
		appView: Array<AppView>;
		board: Array<BoardView>;
		utilityBar: Array<UtilityView>;
		settings: Array<SettingsView>;
		search: Array<SearchView>;
		primaryBarAccessories: Array<PrimaryAccessoryView>;
		secondaryBarAccessories: Array<SecondaryAccessoryView>;
	};
	setters: AppSetters;
	shell: CarbonioModule;
};
