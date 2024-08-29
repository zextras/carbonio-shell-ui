/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { produce } from 'immer';

import { DefaultViewsRegister } from './default-views';
import { SEARCH_APP_ID, SETTINGS_APP_ID, SHELL_APP_ID } from '../../constants';
import { useAccountStore } from '../../store/account';
import { useAppStore } from '../../store/app';
import { useLoginConfigStore } from '../../store/login/store';
import { setup } from '../../tests/utils';
import type { AccountSettingsAttrs } from '../../types/account';
import type { AppRouteDescriptor, SettingsView } from '../../types/apps';

describe('DefaultViews', () => {
	it('should register search module', () => {
		setup(<DefaultViewsRegister />);
		expect(useAppStore.getState().routes).toMatchObject<Record<string, AppRouteDescriptor>>({
			[SEARCH_APP_ID]: {
				id: SEARCH_APP_ID,
				app: SEARCH_APP_ID,
				route: SEARCH_APP_ID,
				label: 'Search',
				position: 1000,
				visible: true,
				primaryBar: 'SearchModOutline',
				badge: { show: false },
				appView: expect.any(Function)
			}
		});
	});

	it.each<AccountSettingsAttrs['zimbraFeatureOptionsEnabled']>(['TRUE', undefined])(
		'should register settings module if zimbraFeatureOptionsEnabled is %s',
		(value) => {
			useAccountStore.setState(
				produce((state) => {
					state.settings.attrs.zimbraFeatureOptionsEnabled = value;
				})
			);
			setup(<DefaultViewsRegister />);
			expect(useAppStore.getState().routes).toMatchObject<Record<string, AppRouteDescriptor>>({
				[SETTINGS_APP_ID]: {
					id: SETTINGS_APP_ID,
					app: SETTINGS_APP_ID,
					route: SETTINGS_APP_ID,
					label: 'Settings',
					position: 1100,
					visible: true,
					primaryBar: 'SettingsModOutline',
					badge: { show: false },
					appView: expect.any(Function),
					secondaryBar: expect.any(Function)
				}
			});
		}
	);

	it('should not register settings module if zimbraFeatureOptionsEnabled is FALSE', () => {
		useAccountStore.setState(
			produce((state) => {
				state.settings.attrs.zimbraFeatureOptionsEnabled = 'FALSE';
			})
		);
		setup(<DefaultViewsRegister />);
		expect(Object.keys(useAppStore.getState().routes)).not.toContain(SETTINGS_APP_ID);
	});

	it('should test', () => {
		expect([{ a: 'a' }, { a: 'b' }]).toContainEqual({ a: 'a' });
	});

	it('should register settings general view', () => {
		useAccountStore.setState(
			produce((state) => {
				state.settings.attrs.zimbraFeatureOptionsEnabled = 'TRUE';
			})
		);
		setup(<DefaultViewsRegister />);
		expect(useAppStore.getState().views.settings).toContainEqual<SettingsView>({
			id: 'general',
			route: 'general',
			app: SHELL_APP_ID,
			component: expect.anything(),
			icon: 'SettingsModOutline',
			label: 'General Settings',
			position: 1,
			subSections: [
				{ label: 'Appearance', id: 'appearance' },
				{ label: 'Language', id: 'language' },
				{ label: 'Out of Office Settings', id: 'out_of_office' },
				{ label: 'Search', id: 'search_prefs' },
				{ label: "User's quota", id: 'user_quota' }
			]
		});
	});

	it('should register privacy settings subsection if it is carbonio CE ', () => {
		useAccountStore.setState(
			produce((state) => {
				state.settings.attrs.zimbraFeatureOptionsEnabled = 'TRUE';
			})
		);
		useLoginConfigStore.setState({ isCarbonioCE: true });

		setup(<DefaultViewsRegister />);
		expect(useAppStore.getState().views.settings).toContainEqual(
			expect.objectContaining<Pick<SettingsView, 'id' | 'subSections'>>({
				id: 'general',
				subSections: [
					{ label: 'Appearance', id: 'appearance' },
					{ label: 'Language', id: 'language' },
					{ label: 'Out of Office Settings', id: 'out_of_office' },
					{ label: 'Search', id: 'search_prefs' },
					{ label: "User's quota", id: 'user_quota' },
					{ label: 'Privacy', id: 'privacy-settings' }
				]
			})
		);
	});

	it('should not register privacy settings subsection if it is not carbonio CE ', () => {
		useAccountStore.setState(
			produce((state) => {
				state.settings.attrs.zimbraFeatureOptionsEnabled = 'TRUE';
			})
		);
		useLoginConfigStore.setState({ isCarbonioCE: false });

		setup(<DefaultViewsRegister />);
		expect(useAppStore.getState().views.settings).toContainEqual(
			expect.objectContaining<Pick<SettingsView, 'id' | 'subSections'>>({
				id: 'general',
				subSections: [
					{ label: 'Appearance', id: 'appearance' },
					{ label: 'Language', id: 'language' },
					{ label: 'Out of Office Settings', id: 'out_of_office' },
					{ label: 'Search', id: 'search_prefs' },
					{ label: "User's quota", id: 'user_quota' }
				]
			})
		);
	});

	it('should register settings accounts view', () => {
		useAccountStore.setState(
			produce((state) => {
				state.settings.attrs.zimbraFeatureOptionsEnabled = 'TRUE';
			})
		);
		setup(<DefaultViewsRegister />);
		expect(useAppStore.getState().views.settings).toContainEqual<SettingsView>({
			id: 'accounts',
			route: 'accounts',
			app: SHELL_APP_ID,
			component: expect.any(Function),
			icon: 'PersonOutline',
			label: 'Accounts',
			position: 1
		});
	});
});
