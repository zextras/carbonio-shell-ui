/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC } from 'react';

import { trim } from 'lodash';

import {
	AppRouteDescriptor,
	BadgeInfo,
	BoardView,
	CarbonioModule,
	PrimaryAccessoryView,
	SearchView,
	SecondaryAccessoryView,
	SettingsView,
	UtilityView
} from '../../../types';

export const normalizeApp = (app: Partial<CarbonioModule>): CarbonioModule => ({
	commit: app.commit ?? '',
	description: app.description ?? 'A carbonio Module',
	// eslint-disable-next-line camelcase
	js_entrypoint: app.js_entrypoint ?? '',
	name: app.name ?? 'module',
	priority: app.priority ?? 99,
	version: app.version ?? '',
	type: app.type ?? 'carbonio',
	attrKey: app.attrKey,
	icon: app.icon ?? 'Cube',
	display: app.display ?? 'Module',
	sentryDsn: app.sentryDsn
});

const FallbackView: FC = () => <p>Missing Component</p>;

export const normalizeBadgeInfo = (badge: Partial<BadgeInfo>): BadgeInfo => ({
	show: badge.show ?? false,
	count: badge.count ?? 0,
	showCount: badge.showCount ?? false,
	color: badge.color ?? 'primary'
});

export const normalizeRoute = (
	data: Partial<AppRouteDescriptor>,
	app: CarbonioModule
): AppRouteDescriptor => {
	const route = trim(data.route ?? app.name, '/');
	return {
		app: app.name,
		route,
		id: data.id ?? route,
		badge: normalizeBadgeInfo(data?.badge ?? {}),
		position: data?.position ?? app.priority,
		visible: data?.visible ?? true,
		label: data?.label ?? '',
		primaryBar: data.primaryBar ?? app.icon ?? 'CubeOutline',
		secondaryBar: data.secondaryBar,
		appView: data.appView ?? FallbackView,
		standalone: data.standalone
	};
};

export const normalizeSettingsView = (
	data: Partial<SettingsView>,
	app: CarbonioModule
): SettingsView => {
	const route = trim(data.route ?? app.name, '/');
	return {
		app: app.name,
		route,
		id: data?.id ?? route,
		component: data?.component ?? FallbackView,
		label: data.label ?? app.display,
		icon: data.icon ?? app.icon,
		position: data.position ?? app.priority ?? 99,
		subSections: data.subSections ?? []
	};
};
export const normalizeSearchView = (data: Partial<SearchView>, app: CarbonioModule): SearchView => {
	const route = trim(data.route ?? app.name, '/');
	return {
		app: app.name,
		route,
		id: data?.id ?? route,
		component: data?.component ?? FallbackView,
		label: data.label ?? app.display,
		icon: data.icon ?? app.icon,
		position: data.position ?? app.priority ?? 99
	};
};
export const normalizeUtilityView = (
	data: Partial<UtilityView>,
	app: CarbonioModule
): UtilityView => ({
	app: app.name,
	id: data?.id ?? app.name,
	whitelistRoutes: data?.whitelistRoutes,
	blacklistRoutes: data?.blacklistRoutes,
	component: data?.component ?? FallbackView,
	button: data?.button ?? 'Cube',
	badge: normalizeBadgeInfo(data?.badge ?? {}),
	position: data?.position ?? app.priority,
	label: data?.label ?? app.display
});
export const normalizePrimaryAccessoryView = (
	data: Partial<PrimaryAccessoryView>,
	app: CarbonioModule
): PrimaryAccessoryView => ({
	app: app.name,
	onClick: data?.onClick,
	label: data?.label ?? app.display,
	position: data?.position ?? app.priority,
	whitelistRoutes: data?.whitelistRoutes,
	blacklistRoutes: data?.blacklistRoutes,
	id: data?.id ?? app.name,
	component: data?.component ?? FallbackView
});
export const normalizeSecondaryAccessoryView = (
	data: Partial<SecondaryAccessoryView>,
	app: CarbonioModule
): SecondaryAccessoryView => ({
	app: app.name,
	position: data?.position ?? app.priority,
	whitelistRoutes: data?.whitelistRoutes,
	blacklistRoutes: data?.blacklistRoutes,
	id: data?.id ?? app.name,
	component: data?.component ?? FallbackView
});

export const normalizeBoardView = (data: Partial<BoardView>, app: CarbonioModule): BoardView => {
	const route = trim(data.route ?? app.name, '/');
	return {
		app: app.name,
		route,
		id: data?.id ?? route,
		component: data?.component ?? FallbackView
	};
};
