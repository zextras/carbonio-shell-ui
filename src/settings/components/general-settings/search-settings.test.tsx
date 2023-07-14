/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act, screen } from '@testing-library/react';

import { SearchSettings } from './search-settings';
import { AccountSettings, AccountSettingsPrefs, AddMod } from '../../../../types';
import { ICONS } from '../../../test/constants';
import { setup } from '../../../test/utils';

describe('Search settings', () => {
	test('should render with default values', () => {
		const settings: AccountSettings = {
			prefs: {},
			props: [],
			attrs: {}
		};
		const addModFn = jest.fn();
		setup(<SearchSettings settings={settings} addMod={addModFn} />);
		expect(screen.getByText('Search')).toBeVisible();
		expect(screen.getByText(/include spam folder in searches/i)).toBeVisible();
		expect(screen.getByText(/include trash folder in searches/i)).toBeVisible();
		expect(screen.getByText(/include shared folder in searches/i)).toBeVisible();
		expect(screen.getAllByTestId(ICONS.checkboxUnchecked)).toHaveLength(3);
	});

	test.each<
		[
			NonNullable<
				AccountSettingsPrefs['zimbraPrefIncludeSpamInSearch'] &
					AccountSettingsPrefs['zimbraPrefIncludeTrashInSearch'] &
					AccountSettingsPrefs['zimbraPrefIncludeSharedItemsInSearch']
			>,
			string
		]
	>([
		['TRUE', ICONS.checkboxChecked],
		['FALSE', ICONS.checkboxUnchecked]
	])('should render with pref values set to %s', (prefValue, checkboxIcon) => {
		const settings: AccountSettings = {
			prefs: {
				zimbraPrefIncludeSpamInSearch: prefValue,
				zimbraPrefIncludeTrashInSearch: prefValue,
				zimbraPrefIncludeSharedItemsInSearch: prefValue
			},
			props: [],
			attrs: {}
		};
		const addModFn = jest.fn();
		setup(<SearchSettings settings={settings} addMod={addModFn} />);
		expect(screen.getByText(/include spam folder in searches/i)).toBeVisible();
		expect(screen.getByText(/include trash folder in searches/i)).toBeVisible();
		expect(screen.getByText(/include shared folder in searches/i)).toBeVisible();
		expect(screen.getAllByTestId(checkboxIcon)).toHaveLength(3);
	});

	test.each<[keyof AccountSettingsPrefs & string, string]>([
		['zimbraPrefIncludeSpamInSearch', 'Spam'],
		['zimbraPrefIncludeTrashInSearch', 'Trash'],
		['zimbraPrefIncludeSharedItemsInSearch', 'Shared']
	])('should update %s when toggling %s folder check', async (prefKey, folderType) => {
		const settings: AccountSettings = {
			prefs: {},
			props: [],
			attrs: {}
		};
		const addModFn = jest.fn();
		const { user } = setup(<SearchSettings settings={settings} addMod={addModFn} />);
		await act(async () => {
			await user.click(screen.getByText(RegExp(`include ${folderType} folder in searches`, 'i')));
		});
		expect(addModFn).toHaveBeenCalledTimes(1);
		expect(addModFn).toHaveBeenCalledWith<Parameters<AddMod>>('prefs', prefKey, 'TRUE');
		await act(async () => {
			await user.click(screen.getByText(RegExp(`include ${folderType} folder in searches`, 'i')));
		});
		expect(addModFn).toHaveBeenCalledTimes(2);
		expect(addModFn).toHaveBeenCalledWith<Parameters<AddMod>>('prefs', prefKey, 'FALSE');
	});
});
