/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { screen } from '@testing-library/react';

import GeneralSettings from './general-settings';
import { SettingsSidebar } from './settings-sidebar';
import { SHELL_APP_ID } from '../constants';
import { useAppStore } from '../store/app';
import { ICONS } from '../tests/constants';
import { setup } from '../tests/utils';
import type { SettingsView } from '../types/apps';

describe('Setting sidebar', () => {
	it('should render label and icon when expanded is true', () => {
		const settingsGeneralView: SettingsView = {
			id: 'general',
			route: 'general',
			app: SHELL_APP_ID,
			component: GeneralSettings,
			icon: 'SettingsModOutline',
			label: 'General Settings',
			position: 1
		};
		useAppStore.getState().addSettingsView(settingsGeneralView);
		setup(<SettingsSidebar expanded />);
		expect(screen.getByText('General Settings')).toBeVisible();
		expect(screen.getByTestId(`icon: ${ICONS.settings}`)).toBeVisible();
	});
	it('should render only icon when expanded is false', () => {
		const settingsGeneralView: SettingsView = {
			id: 'general',
			route: 'general',
			app: SHELL_APP_ID,
			component: GeneralSettings,
			icon: 'SettingsModOutline',
			label: 'General Settings',
			position: 1
		};
		useAppStore.getState().addSettingsView(settingsGeneralView);
		setup(<SettingsSidebar expanded={false} />);
		expect(screen.queryByText('General Settings')).not.toBeInTheDocument();
		expect(screen.getByTestId(`icon: ${ICONS.settings}`)).toBeVisible();
	});
});
