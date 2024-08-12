/* eslint-disable @typescript-eslint/ban-types */
/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { ComponentType, FC } from 'react';
import type React from 'react';

import type { DefaultTheme } from 'styled-components';

import type { QueryChip } from '../search';

export type CarbonioModule = {
	commit: string;
	description: string;
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

export type AppRoute = {
	id: string;
	route: string;
	app: string;
	focusMode?: boolean;
};

export type BadgeInfo = {
	show: boolean;
	icon?: string;
	count?: number;
	showCount?: boolean;
	color?: keyof DefaultTheme['palette'];
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

export type BoardView = Omit<CarbonioView<BoardViewComponentProps>, 'route'>;

export type UtilityView = CarbonioAccessoryView<UtilityBarComponentProps> & {
	button: string | ComponentType<UtilityBarComponentProps>;
	component: ComponentType<UtilityBarComponentProps>;
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
	focusMode?: boolean;
};
