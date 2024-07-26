/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import 'jest-styled-components';
import { screen, waitFor, within } from '@testing-library/react';
import { find } from 'lodash';

import type { LocaleDescriptorWithLabels } from './components/utils';
import { localeList } from './components/utils';
import GeneralSettings from './general-settings';
import { useAccountStore } from '../store/account';
import { useI18nStore } from '../store/i18n/store';
import { useLoginConfigStore } from '../store/login/store';
import { ICONS, TESTID_SELECTORS } from '../tests/constants';
import { setup } from '../tests/utils';
import type { AccountSettingsPrefs } from '../types/account';

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

	describe('Privacy settings', () => {
		it('should be visible if Carbonio is CE', async () => {
			useLoginConfigStore.setState({ isCarbonioCE: true });
			setup(<GeneralSettings />);
			expect(screen.getByText('Privacy')).toBeVisible();
		});

		it('should not be visible if Carbonio is not CE', () => {
			useLoginConfigStore.setState({ isCarbonioCE: false });
			setup(<GeneralSettings />);
			expect(screen.queryByText('Privacy')).not.toBeInTheDocument();
		});

		it('should be checked by default if carbonioPrefSendAnalytics is TRUE', () => {
			useLoginConfigStore.setState({ isCarbonioCE: true });
			useAccountStore.setState((state) => ({
				...state,
				settings: {
					...state.settings,
					prefs: { ...state.settings.prefs, carbonioPrefSendAnalytics: 'TRUE' }
				}
			}));

			setup(<GeneralSettings />);
			expect(
				within(screen.getByTestId(TESTID_SELECTORS.privacySettings)).getByTestId(
					ICONS.checkboxChecked
				)
			).toBeVisible();
		});

		it.each<AccountSettingsPrefs['carbonioPrefSendAnalytics']>(['FALSE', undefined])(
			'should be unchecked by default if carbonioPrefSendAnalytics is %s',
			(initial) => {
				useLoginConfigStore.setState({ isCarbonioCE: true });
				useAccountStore.setState((state) => ({
					...state,
					settings: {
						...state.settings,
						prefs: { ...state.settings.prefs, carbonioPrefSendAnalytics: initial }
					}
				}));

				setup(<GeneralSettings />);
				expect(
					within(screen.getByTestId(TESTID_SELECTORS.privacySettings)).getByTestId(
						ICONS.checkboxUnchecked
					)
				).toBeVisible();
			}
		);

		it.each<AccountSettingsPrefs['carbonioPrefSendAnalytics']>(['TRUE', 'FALSE', undefined])(
			'should enable discard and save buttons if the user set a value different from the initial one (%s)',
			async (initial) => {
				useLoginConfigStore.setState({ isCarbonioCE: true });
				useAccountStore.setState((state) => ({
					...state,
					settings: {
						...state.settings,
						prefs: { ...state.settings.prefs, carbonioPrefSendAnalytics: initial }
					}
				}));

				const { user } = setup(<GeneralSettings />);
				await user.click(screen.getByText('Allow data analytics'));
				expect(screen.getByRole('button', { name: /discard changes/i })).toBeEnabled();
				expect(screen.getByRole('button', { name: /save/i })).toBeEnabled();
			}
		);

		it.each<AccountSettingsPrefs['carbonioPrefSendAnalytics']>(['TRUE', 'FALSE', undefined])(
			'should disable discard and save buttons if the user set a value equal to the initial one (%s)',
			async (initial) => {
				useLoginConfigStore.setState({ isCarbonioCE: true });
				useAccountStore.setState((state) => ({
					...state,
					settings: {
						...state.settings,
						prefs: { ...state.settings.prefs, carbonioPrefSendAnalytics: initial }
					}
				}));

				const { user } = setup(<GeneralSettings />);
				await user.click(screen.getByText('Allow data analytics'));
				expect(screen.getByRole('button', { name: /discard changes/i })).toBeEnabled();
				await user.click(screen.getByText('Allow data analytics'));
				expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
				expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
			}
		);

		it('should reset the value to the initial one when clicking on discard', async () => {
			useLoginConfigStore.setState({ isCarbonioCE: true });
			useAccountStore.setState((state) => ({
				...state,
				settings: {
					...state.settings,
					prefs: {
						...state.settings.prefs,
						carbonioPrefSendAnalytics: 'TRUE'
					}
				}
			}));

			const { user } = setup(<GeneralSettings />);
			await user.click(screen.getByText('Allow data analytics'));
			await user.click(screen.getByRole('button', { name: /discard changes/i }));
			await waitFor(() =>
				expect(
					within(screen.getByTestId(TESTID_SELECTORS.privacySettings)).getByTestId(
						ICONS.checkboxChecked
					)
				).toBeVisible()
			);
		});
	});
});
