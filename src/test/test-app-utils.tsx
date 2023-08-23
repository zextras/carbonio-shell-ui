/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { faker } from '@faker-js/faker';

import { AppRouteDescriptor, CarbonioModule } from '../../types';
import { useAppStore } from '../store/app';

export const mockedApps: CarbonioModule[] = [
	{
		commit: '',
		description: 'Mails module',
		display: 'Mails',
		icon: 'MailModOutline',
		js_entrypoint: '',
		name: 'carbonio-mails-ui',
		priority: 1,
		type: 'carbonio',
		version: '0.0.1'
	}
];

export const mockedRoutes: AppRouteDescriptor = {
	id: 'mails',
	route: 'mails',
	position: 1,
	visible: true,
	label: 'Mails',
	primaryBar: 'MailModOutline',
	appView: () => <div></div>,
	badge: { show: false },
	app: 'carbonio-mails-ui'
};

export function setupAppStore(apps = mockedApps, routes = [mockedRoutes]): void {
	useAppStore.getState().setters.setApps(apps);
	routes.forEach((route) => {
		useAppStore.getState().setters.addRoute(route);
	});
}

export function generateCarbonioModule(data?: Partial<CarbonioModule>): CarbonioModule {
	return {
		commit: '',
		description: faker.commerce.productDescription(),
		display: faker.commerce.productName(),
		icon: 'PeopleOutline',
		js_entrypoint: '',
		name: `carbonio-${faker.word.sample()}-ui`,
		priority: 1,
		type: 'carbonio',
		version: '0.0.1',
		...data
	};
}

export function generateModuleRouteDescriptor(
	data?: Partial<AppRouteDescriptor>
): AppRouteDescriptor {
	const id = data?.id || faker.string.sample();
	const route = id.replace('carbonio-', '').replace('-ui', '');
	return {
		id,
		route,
		app: id,
		position: 1,
		visible: true,
		label: faker.commerce.productName(),
		primaryBar: 'PeopleOutline',
		appView: () => <div>{id}</div>,
		badge: { show: false },
		...data
	};
}
