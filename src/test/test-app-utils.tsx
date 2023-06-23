/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

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

export function setupAppStore(apps = mockedApps, routes = mockedRoutes): void {
	useAppStore.getState().setters.addApps(apps);
	useAppStore.getState().setters.addRoute(routes);
}
