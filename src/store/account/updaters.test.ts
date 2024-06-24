/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useAccountStore } from './store';
import { updateSettings } from './updaters';
import { setupAccountStore } from '../../tests/account-utils';

describe('updateSettings', () => {
	it('should leave the state settings unchanged if no mods are set', () => {
		setupAccountStore();
		const prevSettings = useAccountStore.getState().settings;
		updateSettings({});
		expect(useAccountStore.getState().settings).toEqual(prevSettings);
	});

	it('should merge the given attr and leave the existing unchanged', () => {
		setupAccountStore({
			accountSettingsAttrs: {
				existingAttr: 'existing attr value'
			}
		});
		updateSettings({ attrs: { newAttr: 'new attr value' } });
		expect(useAccountStore.getState().settings).toEqual(
			expect.objectContaining({
				attrs: { existingAttr: 'existing attr value', newAttr: 'new attr value' }
			})
		);
	});

	it('should merge the given prop and leave the existing unchanged', () => {
		setupAccountStore({
			accountSettingsProps: [
				{
					name: 'existing prop name',
					zimlet: 'existing prop zimlet',
					_content: 'existing prop content'
				}
			]
		});
		updateSettings({
			props: {
				newProp: { app: 'new zimlet', value: 'enabled' }
			}
		});
		expect(useAccountStore.getState().settings).toEqual(
			expect.objectContaining({
				props: expect.arrayContaining([
					expect.objectContaining({ name: 'existing prop name' }),
					expect.objectContaining({ name: 'newProp' })
				])
			})
		);
	});

	it('should merge the given pref and leave the existing unchanged', () => {
		setupAccountStore({
			accountSettingsPrefs: {
				existingPref: 'existing pref value'
			}
		});
		updateSettings({ prefs: { newPref: 'new pref value' } });
		expect(useAccountStore.getState().settings).toEqual(
			expect.objectContaining({
				prefs: { existingPref: 'existing pref value', newPref: 'new pref value' }
			})
		);
	});

	it.todo('should override the given attr');

	it.todo('should override the given prop');

	it.todo('should override the given pref');
});
