/* eslint-disable @typescript-eslint/ban-types */
/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ComponentType, FC } from 'react';
import { QueryChip } from '../search/items';

export type CarbonioModule = {
	commit: string;
	description: string;
	// eslint-disable-next-line camelcase
	js_entrypoint: string;
	name: string;
	priority: number;
	version: string;
	type: 'carbonio' | 'shell';
	attrKey?: string;
	icon: string;
	display: string;
	sentryDsn?: string;
};

export type StandaloneFlags = {
	hidePrimaryBar?: boolean;
	hideShellHeader?: boolean;
	allowUnauthenticated?: boolean;
};

export type AppRoute = {
	// persist?: boolean;
	id: string;
	route: string;
	app: string;
	standalone?: StandaloneFlags;
};

export type AppRouteData = AppRoute & {
	primaryBar: PrimaryBarView;
	secondaryBar?: SecondaryBarView;
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

export type CarbonioAccessoryView<P> = {
	id: string;
	app: string;
	whitelistRoutes?: Array<string>;
	blacklistRoutes?: Array<string>;
	position: number;
	component: ComponentType<P>;
};
export type PrimaryBarComponentProps = { active: boolean };
export type SecondaryBarComponentProps = { expanded: boolean };
export type AppViewComponentProps = {};
export type BoardViewComponentProps = {};
export type SettingsViewProps = {};
export type SearchViewProps = {
	useQuery: () => [QueryChip[], Function];
	ResultsHeader: FC<{ label: string }>;
	useDisableSearch: () => [boolean, Function];
};
export type PrimaryAccessoryViewProps = {};
export type SecondaryAccessoryViewProps = { expanded: boolean };
export type PanelMode = 'closed' | 'overlap' | 'open';

export type UtilityBarComponentProps = { mode: PanelMode; setMode: (mode: PanelMode) => void };
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

export type UtilityView = CarbonioAccessoryView<UtilityBarComponentProps> & {
	button: string | ComponentType<UtilityBarComponentProps>;
	component: ComponentType<UtilityBarComponentProps>;
	badge: BadgeInfo;
	label: string;
};
export type SettingsSubSection = { label: string; id: string };
export type SettingsView = CarbonioView<SettingsViewProps> & {
	icon: string;
	label: string;
	position: number;
	subSections?: Array<SettingsSubSection>;
};

export type SearchView = CarbonioView<SearchViewProps> & {
	icon: string;
	label: string;
	position: number;
};

export type PrimaryAccessoryView = CarbonioAccessoryView<PrimaryAccessoryViewProps> & {
	component: string | ComponentType;
	onClick?: (ev: KeyboardEvent | React.MouseEvent<HTMLButtonElement> | undefined) => void;
	label: string;
};

export type SecondaryAccessoryView = CarbonioAccessoryView<SecondaryAccessoryViewProps>;

export type AppRouteDescriptor = {
	id: string;
	route: string;
	app: string;
	primaryBar: string | ComponentType<PrimaryBarComponentProps>;
	badge: BadgeInfo;
	position: number;
	visible: boolean;
	label: string;
	secondaryBar?: ComponentType<SecondaryBarComponentProps>;
	appView: ComponentType<AppViewComponentProps>;
	standalone?: StandaloneFlags;
};
export type AppSetters = {
	addApps: (apps: Array<Partial<CarbonioModule>>) => void;
	// add route (id route primaryBar secondaryBar app)
	addRoute: (routeData: AppRouteDescriptor) => string;
	setRouteVisibility: (id: string, visible: boolean) => void;
	// remove route (id | route)
	removeRoute: (id: string) => void;
	//
	// update primaryBar
	updatePrimaryBadge: (badge: Partial<BadgeInfo>, id: string) => void;
	updateUtilityBadge: (badge: Partial<BadgeInfo>, id: string) => void;
	//
	// add board
	addBoardView: (data: BoardView) => string;
	// remove board
	removeBoardView: (id: string) => void;
	//
	// add settings
	addSettingsView: (data: SettingsView) => string;
	// remove settings
	removeSettingsView: (id: string) => void;
	//
	// add search
	addSearchView: (data: SearchView) => string;
	// remove search
	removeSearchView: (id: string) => void;
	//
	// add utility
	addUtilityView: (data: UtilityView) => string;
	// remove utility
	removeUtilityView: (id: string) => void;
	//
	// add primaryAccessory
	addPrimaryAccessoryView: (data: PrimaryAccessoryView) => string;
	// remove primaryAccessory
	removePrimaryAccessoryView: (id: string) => void;
	//
	// add secondaryAccessory
	addSecondaryAccessoryView: (data: SecondaryAccessoryView) => string;
	// remove secondaryAccessory
	removeSecondaryAccessoryView: (id: string) => void;
	setAppContext: (app: string) => (context: unknown) => void;
};
export type AppState = {
	standalone: false | string;
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
