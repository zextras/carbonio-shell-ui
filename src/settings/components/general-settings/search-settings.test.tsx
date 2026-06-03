/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { act, screen } from '@testing-library/react';
import type { AccountSettingsPrefs } from '@zextras/carbonio-ui-soap-lib';

import { SearchSettings } from './search-settings';
import { ICONS } from '../../../tests/constants';
import { setup } from '../../../tests/utils';
import type { AccountSettings } from '../../../types/account';
import type { AddMod } from '../../../types/network';

describe('Search settings', () => {
	test('should render with default values', () => {
		const settings: AccountSettings = {
			prefs: {},
			props: [],
			attrs: {}
		};
		const addModFn = vi.fn();
		setup(<SearchSettings settings={settings} addMod={addModFn} />);
		expect(screen.getByText('Search'), 'the Search section title should be visible').toBeVisible();
		expect(
			screen.getByText(/include spam folder in searches/i),
			'the spam folder option should be visible'
		).toBeVisible();
		expect(
			screen.getByText(/include trash folder in searches/i),
			'the trash folder option should be visible'
		).toBeVisible();
		expect(
			screen.getByText(/include shared folder in searches/i),
			'the shared folder option should be visible'
		).toBeVisible();
		expect(
			screen.getAllByTestId(ICONS.checkboxUnchecked),
			'all three search options should be unchecked by default'
		).toHaveLength(3);
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
		const addModFn = vi.fn();
		setup(<SearchSettings settings={settings} addMod={addModFn} />);
		expect(
			screen.getByText(/include spam folder in searches/i),
			'the spam folder option should be visible'
		).toBeVisible();
		expect(
			screen.getByText(/include trash folder in searches/i),
			'the trash folder option should be visible'
		).toBeVisible();
		expect(
			screen.getByText(/include shared folder in searches/i),
			'the shared folder option should be visible'
		).toBeVisible();
		expect(
			screen.getAllByTestId(checkboxIcon),
			`all three options should reflect the pref value (${prefValue})`
		).toHaveLength(3);
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
		const addModFn = vi.fn();
		const { user } = setup(<SearchSettings settings={settings} addMod={addModFn} />);
		await act(async () => {
			await user.click(screen.getByText(RegExp(`include ${folderType} folder in searches`, 'i')));
		});
		expect(addModFn, `checking the ${folderType} folder should add one mod`).toHaveBeenCalledTimes(
			1
		);
		expect(
			addModFn,
			`checking the ${folderType} folder should set ${prefKey} to TRUE`
		).toHaveBeenCalledWith<Parameters<AddMod>>('prefs', prefKey, 'TRUE');
		await act(async () => {
			await user.click(screen.getByText(RegExp(`include ${folderType} folder in searches`, 'i')));
		});
		expect(
			addModFn,
			`unchecking the ${folderType} folder should add a second mod`
		).toHaveBeenCalledTimes(2);
		expect(
			addModFn,
			`unchecking the ${folderType} folder should set ${prefKey} to FALSE`
		).toHaveBeenCalledWith<Parameters<AddMod>>('prefs', prefKey, 'FALSE');
	});
});
