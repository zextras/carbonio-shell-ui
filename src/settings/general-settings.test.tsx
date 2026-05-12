/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { screen, waitFor, within } from '@testing-library/react';
import type { AccountSettingsPrefs } from '@zextras/carbonio-ui-soap-lib';
import { find } from 'lodash';

import { buildItemsExternalSenders } from './components/general-settings/out-of-office-settings';
import { dateToGenTime } from './components/utils';
import GeneralSettings from './general-settings';
import { SETTINGS_OUT_OF_OFFICE_TEXT_AREA_MAX_CHAR_LIMIT } from '../constants/internal-constants';
import type { LocaleDescriptorWithLabels } from '../constants/locales';
import { localeList } from '../constants/locales';
import { useAccountStore } from '../store/account';
import { useI18nStore } from '../store/i18n/store';
import { useLoginConfigStore } from '../store/login/store';
import { ICONS, TESTID_SELECTORS } from '../tests/constants';
import { setup } from '../tests/utils';

describe('General setting', () => {
	const { defaultI18n } = useI18nStore.getState();
	const localeArray = localeList(defaultI18n.t);

	test('When there are changes and an error, the discard button is enabled but save button is disabled', async () => {
		const zimbraPrefLocaleValue = 'en';
		useAccountStore.setState((previousState) => ({
			...previousState,
			settings: {
				...previousState.settings,
				prefs: {
					zimbraPrefOutOfOfficeReplyEnabled: 'TRUE',
					zimbraPrefOutOfOfficeReply: faker.string.sample(
						SETTINGS_OUT_OF_OFFICE_TEXT_AREA_MAX_CHAR_LIMIT + 1
					),
					zimbraPrefLocale: zimbraPrefLocaleValue
				}
			}
		}));
		const { user } = setup(<GeneralSettings />);
		const match = find(
			localeArray,
			(item) => item.value === zimbraPrefLocaleValue
		) as LocaleDescriptorWithLabels;
		await user.click(screen.getByText(match.label));
		await user.click(
			within(screen.getByTestId(TESTID_SELECTORS.dropdown)).getByText(localeArray[0].label)
		);
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeEnabled();
		expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
	});

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

	test('When send auto reply is changed, discard button become enabled and when clicked the initial value is restored', async () => {
		useAccountStore.setState((previousState) => ({
			...previousState,
			settings: {
				...previousState.settings,
				prefs: { zimbraPrefOutOfOfficeReplyEnabled: 'TRUE' }
			}
		}));
		const { user } = setup(<GeneralSettings />);

		await user.click(screen.getByTestId(ICONS.switchChecked));

		expect(screen.getByTestId(ICONS.switchUnchecked)).toBeVisible();
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeEnabled();

		await user.click(screen.getByRole('button', { name: /discard changes/i }));

		expect(screen.getByTestId(ICONS.switchChecked)).toBeVisible();
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
	});

	test('When external sender is changed, discard button become enabled and when clicked the initial value is restored', async () => {
		const externalSenderArray = Object.values(buildItemsExternalSenders(defaultI18n.t));

		useAccountStore.setState((previousState) => ({
			...previousState,
			settings: {
				...previousState.settings,
				prefs: {
					zimbraPrefOutOfOfficeReplyEnabled: 'TRUE',
					zimbraPrefExternalSendersType: 'INSD',
					zimbraPrefOutOfOfficeExternalReplyEnabled: 'FALSE',
					zimbraPrefOutOfOfficeSuppressExternalReply: 'FALSE'
				}
			}
		}));
		const { user } = setup(<GeneralSettings />);
		const match = externalSenderArray[0];
		expect(match).toBeDefined();
		expect(screen.getByText(match.label)).toBeVisible();
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
		await user.click(screen.getByText(match.label));
		await user.click(
			within(screen.getByTestId(TESTID_SELECTORS.dropdown)).getByText(externalSenderArray[1].label)
		);
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeEnabled();
		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(screen.getByText(match.label)).toBeVisible();
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
	});

	test('When auto-replies in time period is changed, discard button become enabled and when clicked the initial value is restored', async () => {
		const date = dateToGenTime(new Date(new Date().setSeconds(0, 0)));
		useAccountStore.setState((previousState) => ({
			...previousState,
			settings: {
				...previousState.settings,
				prefs: {
					zimbraPrefOutOfOfficeReplyEnabled: 'TRUE',
					zimbraPrefOutOfOfficeFromDate: date,
					zimbraPrefOutOfOfficeUntilDate: date
				}
			}
		}));
		const { user } = setup(<GeneralSettings />);
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
		await user.click(
			within(screen.getByTestId(TESTID_SELECTORS.outOfOfficeSettings)).getByTestId(
				ICONS.checkboxChecked
			)
		);

		expect(screen.getByRole('button', { name: /discard changes/i })).toBeEnabled();
		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(
			within(screen.getByTestId(TESTID_SELECTORS.outOfOfficeSettings)).getByTestId(
				ICONS.checkboxChecked
			)
		).toBeVisible();
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
	});

	test('When auto reply textarea value is changed, discard button become enabled and when clicked the initial value is restored', async () => {
		const initialValue = faker.lorem.paragraph();
		const userInput = faker.lorem.paragraphs();

		useAccountStore.setState((previousState) => ({
			...previousState,
			settings: {
				...previousState.settings,
				prefs: {
					zimbraPrefOutOfOfficeReplyEnabled: 'TRUE',
					zimbraPrefOutOfOfficeReply: initialValue
				}
			}
		}));
		const { user } = setup(<GeneralSettings />);
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
		const textbox = screen.getByRole('textbox', { name: 'Auto-Reply Message:' });
		await user.clear(textbox);
		await user.paste(userInput);

		expect(screen.getByRole('button', { name: /discard changes/i })).toBeEnabled();
		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(textbox).toHaveValue(initialValue);
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
	});

	test('When external sender textarea value is changed, discard button become enabled and when clicked the initial value is restored', async () => {
		const initialValue = faker.lorem.paragraph();
		const userInput = faker.lorem.paragraphs();

		useAccountStore.setState((previousState) => ({
			...previousState,
			settings: {
				...previousState.settings,
				prefs: {
					zimbraPrefOutOfOfficeReplyEnabled: 'TRUE',
					zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE',
					zimbraPrefOutOfOfficeExternalReply: initialValue
				}
			}
		}));
		const { user } = setup(<GeneralSettings />);
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
		const textbox = screen.getByRole('textbox', {
			name: 'Auto-Reply Message for External senders:'
		});
		await user.clear(textbox);
		await user.paste(userInput);

		expect(screen.getByRole('button', { name: /discard changes/i })).toBeEnabled();
		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(textbox).toHaveValue(initialValue);
		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
	});

	test('When dark mode is changed, discard button become enabled and when clicked the initial value is restored', async () => {
		useAccountStore.setState((previousState) => ({
			...previousState,
			settings: {
				...previousState.settings,
				prefs: { carbonioPrefDarkMode: 'auto' }
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

	describe('Theme Options', () => {
		it('should render an error if the value is undefined', () => {
			useAccountStore.setState((previousState) => ({
				settings: {
					...previousState.settings,
					prefs: {}
				}
			}));
			setup(<GeneralSettings />);

			expect(screen.getByText(/dark mode/i)).toBeVisible();
			const selectSection = screen.getByTestId('select-dark-theme');
			expect(within(selectSection).getByText(/invalid option/i)).toBeVisible();
			expect(
				within(selectSection).getByText(
					'The current value is not recognized. The interface has defaulted to System theme. Please select a valid option to change the theme.'
				)
			).toBeVisible();
		});
	});

	describe('Language settings', () => {
		it('should render an error if the value set is invalid', () => {
			const zimbraPrefLocaleValue = 'wrongLocale';
			useAccountStore.setState((previousState) => ({
				...previousState,
				settings: {
					...previousState.settings,
					prefs: { zimbraPrefLocale: zimbraPrefLocaleValue }
				}
			}));

			setup(<GeneralSettings />);
			expect(screen.getByText(/invalid option/i)).toBeVisible();
			expect(
				screen.getByText(
					'The current value is not recognized. The interface has defaulted to English. Please select a valid option.'
				)
			).toBeVisible();
		});
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

	describe('User quota section', () => {
		it('should be visible if Carbonio is not CE and totalQuota feature flag is not enabled', () => {
			useLoginConfigStore.setState({ isCarbonioCE: false, featureFlags: { totalQuota: false } });
			setup(<GeneralSettings />);
			expect(screen.getByText("User's quota")).toBeVisible();
		});

		it('should not be visible if Carbonio is CE', () => {
			useLoginConfigStore.setState({ isCarbonioCE: true, featureFlags: { totalQuota: false } });
			setup(<GeneralSettings />);
			expect(screen.queryByText("User's quota")).not.toBeInTheDocument();
		});

		it('should not be visible if totalQuota feature flag is enabled', () => {
			useLoginConfigStore.setState({ isCarbonioCE: false, featureFlags: { totalQuota: true } });
			setup(<GeneralSettings />);
			expect(screen.queryByText("User's quota")).not.toBeInTheDocument();
		});
	});
});
