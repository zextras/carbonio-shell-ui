/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { ComponentType } from 'react';
import type React from 'react';

import type { Theme } from '@zextras/carbonio-design-system';

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
	color?: keyof Theme['palette'];
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
export type PrimaryBarComponentProps = { active: boolean; onClick: () => void };
export type SecondaryBarComponentProps = { expanded: boolean };
/*
 * These four types mean "this component takes no props". They are public API: the modules
 * intersect them and assign components to `ComponentType<...>` slots, so their assignability
 * is a contract we must not change in a patch.
 *
 * `NonNullable<unknown>` is `{}` at the type level, so it keeps that contract byte for byte,
 * while satisfying both `ban-types` (v6) and `no-empty-object-type` (v8). It is one of the
 * replacements typescript-eslint itself suggests for `{}`.
 *
 * `object` would look cleaner but is not equivalent: only a type alias of an object literal
 * gets an implicit index signature, so `{}` is assignable to `Record<string, unknown>` and
 * `object` is not. That silently breaks any module assigning an `FC<Record<string, unknown>>`
 * to one of these slots, or using an HOC constrained on `P extends Record<string, unknown>`.
 */
export type AppViewComponentProps = NonNullable<unknown>;
export type BoardViewComponentProps = NonNullable<unknown>;
export type SettingsViewProps = NonNullable<unknown>;
export type PrimaryAccessoryViewProps = NonNullable<unknown>;
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
	panelVisible: boolean;
};
export type SettingsSubSection = { label: string; id: string };
export type SettingsView = CarbonioView<SettingsViewProps> & {
	icon: string;
	label: string;
	position: number;
	subSections?: Array<SettingsSubSection>;
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
