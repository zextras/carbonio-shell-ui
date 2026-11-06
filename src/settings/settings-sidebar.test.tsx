/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import type { Mock } from 'vitest';

import GeneralSettings from './general-settings';
import { SettingsSidebar } from './settings-sidebar';
import { SHELL_APP_ID } from '../constants';
import { useAppStore } from '../store/app';
import { ICONS } from '../tests/constants';
import { setup } from '../tests/utils';
import type { SettingsView } from '../types/apps';

vi.mock('react-router-dom', async () => ({
	...(await vi.importActual('react-router-dom')),
	useNavigate: vi.fn()
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
		expect(
			screen.getByText('General Settings'),
			'the view label should be visible when the sidebar is expanded'
		).toBeVisible();
		expect(
			screen.getByTestId(`icon: ${ICONS.settings}`),
			'the view icon should be visible when the sidebar is expanded'
		).toBeVisible();
	});
	it('should highlight selected view item with blue background when expanded', () => {
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
		const { container } = setup(<SettingsSidebar expanded />, {
			initialRouterEntries: ['/settings/general']
		});
		// eslint-disable-next-line testing-library/no-node-access
		const itemEl = container.querySelector('[data-testid="accordion-item"] > div') as HTMLElement;
		expect(
			window.getComputedStyle(itemEl).backgroundColor,
			'the selected view item should have highlight blue background'
		).toBe('rgb(213, 227, 246)');
	});
	it('should highlight selected subsection item with blue background when expanded', async () => {
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
				}
			]
		};
		useAppStore.getState().addSettingsView(settingsGeneralView);
		const { user } = setup(<SettingsSidebar expanded />, {
			initialRouterEntries: ['/settings/general?section=section1']
		});
		const icon = screen.getByTestId(`icon: ${ICONS.expandAccordion}`);
		await user.click(icon);
		const subSectionText = screen.getByText('Section 1');
		// eslint-disable-next-line testing-library/no-node-access
		const subSectionItemEl = subSectionText.closest(
			'[data-testid="accordion-item"] > div'
		) as HTMLElement;
		expect(
			window.getComputedStyle(subSectionItemEl).backgroundColor,
			'the selected subsection item should have highlight blue background'
		).toBe('rgb(213, 227, 246)');
	});
	it('should highlight selected item with blue background when collapsed', () => {
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
		setup(<SettingsSidebar expanded={false} />, {
			initialRouterEntries: ['/settings/general']
		});
		const button = screen.getByRole('button');
		expect(
			window.getComputedStyle(button).backgroundColor,
			'the selected collapsed button should have highlight blue background'
		).toBe('rgb(213, 227, 246)');
	});
	it('should not highlight unselected item when collapsed', () => {
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
		setup(<SettingsSidebar expanded={false} />, {
			initialRouterEntries: ['/settings/accounts']
		});
		const button = screen.getByRole('button');
		expect(
			window.getComputedStyle(button).backgroundColor,
			'the unselected collapsed button should have transparent background'
		).toBe('rgba(0, 0, 0, 0)');
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
		expect(
			screen.queryByText('General Settings'),
			'the view label should not be rendered when the sidebar is collapsed'
		).not.toBeInTheDocument();
		expect(
			screen.getByTestId(`icon: ${ICONS.settings}`),
			'the view icon should still be visible when the sidebar is collapsed'
		).toBeVisible();
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
		expect(
			screen.getByText('Section 1'),
			'the first sub section should be visible after expanding the accordion'
		).toBeVisible();
		expect(
			screen.getByText('Section 2'),
			'the second sub section should be visible after expanding the accordion'
		).toBeVisible();
	});
	it('should call navigate when accordion is clicked', async () => {
		const navigate = vi.fn();
		(useNavigate as Mock).mockReturnValue(navigate);
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
		expect(
			navigate,
			'clicking the accordion item should navigate to the view route'
		).toHaveBeenCalledWith('general');
	});
	it('should call navigate when sub section is clicked', async () => {
		const navigate = vi.fn();
		(useNavigate as Mock).mockReturnValue(navigate);
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
		expect(
			navigate,
			'clicking a sub section should navigate to the view route with the section query param'
		).toHaveBeenCalledWith('general?section=section1', { replace: true });
	});
	it('should call navigate when collapsed item is clicked', async () => {
		const navigate = vi.fn();
		(useNavigate as Mock).mockReturnValue(navigate);
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
		expect(
			navigate,
			'clicking the collapsed item icon should navigate to the view route'
		).toHaveBeenCalledWith('general');
	});
});
