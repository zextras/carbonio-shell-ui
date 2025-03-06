/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';

import GeneralSettings from './general-settings';
import { SettingsSidebar } from './settings-sidebar';
import { SHELL_APP_ID } from '../constants';
import { useAppStore } from '../store/app';
import { ICONS } from '../tests/constants';
import { setup } from '../tests/utils';
import type { SettingsView } from '../types/apps';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: jest.fn()
}));

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
	it('should render sub sections', async () => {
		const settingsGeneralView: SettingsView = {
			id: 'general',
			route: 'general',
			app: SHELL_APP_ID,
			component: GeneralSettings,
			icon: 'SettingsModOutline',
			label: 'General Settings',
			position: 1,
			subSections: [
				{
					id: 'section1',
					label: 'Section 1'
				},
				{
					id: 'section2',
					label: 'Section 2'
				}
			]
		};
		useAppStore.getState().addSettingsView(settingsGeneralView);
		const { user } = setup(<SettingsSidebar expanded />);
		const icon = screen.getByTestId(`icon: ${ICONS.expandAccordion}`);
		await user.click(icon);
		expect(screen.getByText('Section 1')).toBeVisible();
		expect(screen.getByText('Section 2')).toBeVisible();
	});
	it('should call navigate when accordion is clicked', async () => {
		const navigate = jest.fn();
		(useNavigate as jest.Mock).mockReturnValue(navigate);
		const settingsGeneralView: SettingsView = {
			id: 'general',
			route: 'general',
			app: 'SHELL_APP_ID',
			component: () => <div>General Settings</div>,
			icon: 'SettingsModOutline',
			label: 'General Settings',
			position: 1
		};
		useAppStore.getState().addSettingsView(settingsGeneralView);
		const { user } = setup(<SettingsSidebar expanded />);
		const accordionItem = screen.getByText('General Settings');
		await user.click(accordionItem);
		expect(navigate).toHaveBeenCalledWith('general');
	});
	it('should call navigate when sub section is clicked', async () => {
		const navigate = jest.fn();
		(useNavigate as jest.Mock).mockReturnValue(navigate);
		const settingsGeneralView: SettingsView = {
			id: 'general',
			route: 'general',
			app: 'SHELL_APP_ID',
			component: () => <div>General Settings</div>,
			icon: 'SettingsModOutline',
			label: 'General Settings',
			position: 1,
			subSections: [
				{
					id: 'section1',
					label: 'Section 1'
				}
			]
		};
		useAppStore.getState().addSettingsView(settingsGeneralView);
		const { user } = setup(<SettingsSidebar expanded />);
		const icon = screen.getByTestId(`icon: ${ICONS.expandAccordion}`);
		await user.click(icon);
		const subSection = screen.getByText('Section 1');
		subSection.style.pointerEvents = 'auto';
		await user.click(subSection);
		expect(navigate).toHaveBeenCalledWith('general?section=section1', { replace: true });
	});
	it('should call navigate when collapsed item is clicked', async () => {
		const navigate = jest.fn();
		(useNavigate as jest.Mock).mockReturnValue(navigate);
		const settingsGeneralView: SettingsView = {
			id: 'general',
			route: 'general',
			app: 'SHELL_APP_ID',
			component: () => <div>General Settings</div>,
			icon: 'SettingsModOutline',
			label: 'General Settings',
			position: 1
		};
		useAppStore.getState().addSettingsView(settingsGeneralView);
		const { user } = setup(<SettingsSidebar expanded={false} />);
		const icon = screen.getByTestId(`icon: ${ICONS.settings}`);
		await user.click(icon);
		expect(navigate).toHaveBeenCalledWith('general');
	});
});
