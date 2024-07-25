/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import 'jest-styled-components';
import { screen, within } from '@testing-library/react';
import { find } from 'lodash';

import type { LocaleDescriptorWithLabels } from './components/utils';
import { localeList } from './components/utils';
import GeneralSettings from './general-settings';
import { useAccountStore } from '../store/account';
import { useI18nStore } from '../store/i18n/store';
import { TESTID_SELECTORS } from '../tests/constants';
import { setup } from '../tests/utils';

describe('General setting', () => {
	const { defaultI18n } = useI18nStore.getState();
	const localeArray = localeList(defaultI18n.t);

	test('When locale is changed, discard button become enabled and when clicked the initial value is restored', async () => {
		const zimbraPrefLocaleValue = 'en';

		useAccountStore.setState((previousState) => ({
			...previousState,
			settings: {
				...previousState.settings,
				prefs: { zimbraPrefLocale: zimbraPrefLocaleValue }
			}
		}));
		const { user } = setup(<GeneralSettings />);
		const match = find(
			localeArray,
			(item) => item.value === zimbraPrefLocaleValue
		) as LocaleDescriptorWithLabels;
		expect(match).toBeDefined();
		expect(screen.getByText(match.label)).toBeVisible();
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
		await user.click(screen.getByText(match.label));
		await user.click(
			within(screen.getByTestId(TESTID_SELECTORS.dropdown)).getByText(localeArray[0].label)
		);
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeEnabled();
		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(screen.getByText(match.label)).toBeVisible();
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
	});

	test('When dark mode is changed, discard button become enabled and when clicked the initial value is restored', async () => {
		useAccountStore.setState((previousState) => ({
			...previousState,
			settings: {
				...previousState.settings,
				props: [{ name: 'zappDarkreaderMode', zimlet: 'carbonio-shell-ui', _content: 'auto' }]
			}
		}));
		const { user } = setup(<GeneralSettings />);
		expect(screen.getByText('Auto')).toBeVisible();
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
		await user.click(screen.getByText('Auto'));
		await user.click(within(screen.getByTestId(TESTID_SELECTORS.dropdown)).getByText(/disabled/i));
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeEnabled();
		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(screen.getByText('Auto')).toBeVisible();
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
	});
});
