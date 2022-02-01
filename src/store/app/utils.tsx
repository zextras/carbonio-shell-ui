/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC } from 'react';
import {
	AppRoute,
	AppRouteData,
	AppView,
	BadgeInfo,
	BoardView,
	CarbonioModule,
	PrimaryAccessoryView,
	PrimaryBarView,
	SearchView,
	SecondaryAccessoryView,
	SecondaryBarView,
	SettingsView,
	UtilityView
} from '../../../types';

export const normalizeApp = (app: Partial<CarbonioModule>): CarbonioModule => ({
	commit: app.commit ?? '',
	description: app.description ?? 'A carbonio Module',
	// eslint-disable-next-line camelcase
	js_entrypoint: app.js_entrypoint ?? '',
	name: app.name ?? 'module',
	priority: 99,
	version: app.version ?? '',
	type: 'app',
	attrKey: app.attrKey ?? '',
	icon: app.icon ?? 'Cube',
	displayName: app.displayName ?? 'Module'
});

const FallbackView: FC = () => <p>Missing Component</p>;

export const normalizeBadgeInfo = (badge: Partial<BadgeInfo>): BadgeInfo => ({
	show: badge.show ?? false,
	count: badge.count ?? 0,
	showCount: badge.showCount ?? false,
	color: badge.color ?? 'primary'
});

export const normalizePrimaryBar = (
	data: Partial<PrimaryBarView> | undefined,
	app: CarbonioModule,
	base: AppRoute
): PrimaryBarView => ({
	...base,
	component: data?.component ?? 'Cube',
	badge: normalizeBadgeInfo(data?.badge ?? {}),
	position: data?.position ?? app.priority,
	visible: data?.visible ?? true,
	label: data?.label ?? ''
});
export const normalizeSecondaryBar = (
	data: Partial<SecondaryBarView> | undefined,
	base: AppRoute
): SecondaryBarView | undefined =>
	data
		? {
				...base,
				component: data.component ?? FallbackView
		  }
		: undefined;
export const normalizeAppView = (data: Partial<AppView> | undefined, base: AppRoute): AppView => ({
	...base,
	component: data?.component ?? FallbackView
});

export const normalizeRoute = (data: Partial<AppRouteData>, app: CarbonioModule): AppRouteData => {
	const baseData = {
		app: app.name,
		route: data.route ?? app.name,
		id: data.id ?? data.route ?? app.name
	};
	return {
		...baseData,
		primaryBar: normalizePrimaryBar(data.primaryBar, app, baseData),
		secondaryBar: normalizeSecondaryBar(data.secondaryBar, baseData),
		appView: normalizeAppView(data.appView, baseData)
	};
};
export const normalizeView = (data: Partial<BoardView>, app: CarbonioModule): BoardView => ({
	app: app.name,
	route: data?.route ?? app.name,
	id: data?.id ?? data?.route ?? app.name,
	component: data?.component ?? FallbackView
});
export const normalizeSettingsView = (
	data: Partial<SettingsView>,
	app: CarbonioModule
): SettingsView => ({
	app: app.name,
	route: data?.route ?? app.name,
	id: data?.id ?? data?.route ?? app.name,
	component: data?.component ?? FallbackView
});
export const normalizeSearchView = (
	data: Partial<SearchView>,
	app: CarbonioModule
): SearchView => ({
	app: app.name,
	route: data?.route ?? app.name,
	id: data?.id ?? data?.route ?? app.name,
	component: data?.component ?? FallbackView
});
export const normalizeUtilityView = (
	data: Partial<UtilityView>,
	app: CarbonioModule
): UtilityView => ({
	app: app.name,
	route: data?.route ?? app.name,
	id: data?.id ?? data?.route ?? app.name,
	component: data?.component ?? FallbackView,
	button: data?.button ?? 'Cube',
	badge: normalizeBadgeInfo(data?.badge ?? {}),
	position: data?.position ?? app.priority,
	label: data?.label ?? ''
});
export const normalizePrimaryAccessoryView = (
	data: Partial<PrimaryAccessoryView>,
	app: CarbonioModule
): PrimaryAccessoryView => ({
	app: app.name,
	route: data?.route ?? app.name,
	id: data?.id ?? data?.route ?? app.name,
	component: data?.component ?? FallbackView
});
export const normalizeSecondaryAccessoryView = (
	data: Partial<SecondaryAccessoryView>,
	app: CarbonioModule
): SecondaryAccessoryView => ({
	app: app.name,
	route: data?.route ?? app.name,
	id: data?.id ?? data?.route ?? app.name,
	component: data?.component ?? FallbackView
});

export const normalizeBoardView = (data: Partial<BoardView>, app: CarbonioModule): BoardView => ({
	app: app.name,
	route: data?.route ?? app.name,
	id: data?.id ?? data?.route ?? app.name,
	component: data?.component ?? FallbackView
});
