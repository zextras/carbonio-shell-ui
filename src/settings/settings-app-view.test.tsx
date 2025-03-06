/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { SettingsAppView } from './settings-app-view';
import { useAppStore } from '../store/app';
import { screen, setup } from '../tests/utils';
import type { SettingsView } from '../types/apps';

describe('SettingsAppView', () => {
	it('should render the component with default route', () => {
		const settingsGeneralView: SettingsView = {
			id: 'general',
			route: 'general',
			app: 'SHELL_APP_ID',
			component: () => <div>General Settings View</div>,
			icon: 'SettingsModOutline',
			label: 'General Settings',
			position: 1
		};
		useAppStore.getState().addSettingsView(settingsGeneralView);
		setup(<SettingsAppView />);
		expect(screen.getByText('General Settings View')).toBeVisible();
	});
	it('should render the current route view', () => {
		const anotherSettingsView: SettingsView = {
			id: 'another',
			route: 'another',
			app: 'SHELL_APP_ID',
			component: () => <div>Another Settings View</div>,
			icon: 'SettingsModOutline',
			label: 'Another Settings',
			position: 2
		};
		useAppStore.getState().addSettingsView(anotherSettingsView);
		setup(<SettingsAppView />, { initialRouterEntries: ['/another'] });
		expect(screen.getByText('Another Settings View')).toBeVisible();
	});
});
