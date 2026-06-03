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

// Default values for i18n keys rendered by out-of-office-settings.tsx — kept here
// as a single source of truth so a copy change requires updating one place.
const LABELS = {
	autoReplyMessage: 'Auto-Reply Message:',
	autoReplyMessageExternal: 'Auto-Reply Message for External senders:'
} as const;

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
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be enabled when there are changes'
		).toBeEnabled();
		expect(
			screen.getByRole('button', { name: /save/i }),
			'the save button should be disabled when there is a validation error'
		).toBeDisabled();
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
		expect(match, 'the locale matching the initial value should be found').toBeDefined();
		expect(
			screen.getByText(match.label),
			'the initial locale label should be visible'
		).toBeVisible();
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be disabled before any change'
		).toBeDisabled();
		await user.click(screen.getByText(match.label));
		await user.click(
			within(screen.getByTestId(TESTID_SELECTORS.dropdown)).getByText(localeArray[0].label)
		);
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be enabled after changing the locale'
		).toBeEnabled();
		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(
			screen.getByText(match.label),
			'the initial locale label should be restored after discarding'
		).toBeVisible();
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be disabled again after discarding'
		).toBeDisabled();
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

		expect(
			screen.getByTestId(ICONS.switchUnchecked),
			'the send auto reply switch should become unchecked after toggling'
		).toBeVisible();
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be enabled after toggling the send auto reply switch'
		).toBeEnabled();

		await user.click(screen.getByRole('button', { name: /discard changes/i }));

		expect(
			screen.getByTestId(ICONS.switchChecked),
			'the send auto reply switch should be restored to checked after discarding'
		).toBeVisible();
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be disabled again after discarding'
		).toBeDisabled();
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
		expect(match, 'the initial external sender option should be defined').toBeDefined();
		expect(
			screen.getByText(match.label),
			'the initial external sender label should be visible'
		).toBeVisible();
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be disabled before changing the external sender'
		).toBeDisabled();
		await user.click(screen.getByText(match.label));
		await user.click(
			within(screen.getByTestId(TESTID_SELECTORS.dropdown)).getByText(externalSenderArray[1].label)
		);
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be enabled after changing the external sender'
		).toBeEnabled();
		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(
			screen.getByText(match.label),
			'the initial external sender label should be restored after discarding'
		).toBeVisible();
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be disabled again after discarding'
		).toBeDisabled();
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
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be disabled before changing the auto-replies time period'
		).toBeDisabled();
		await user.click(
			within(screen.getByTestId(TESTID_SELECTORS.outOfOfficeSettings)).getByTestId(
				ICONS.checkboxChecked
			)
		);

		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be enabled after changing the auto-replies time period'
		).toBeEnabled();
		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(
			within(screen.getByTestId(TESTID_SELECTORS.outOfOfficeSettings)).getByTestId(
				ICONS.checkboxChecked
			),
			'the time period checkbox should be restored to checked after discarding'
		).toBeVisible();
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be disabled again after discarding'
		).toBeDisabled();
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
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be disabled before editing the auto reply textarea'
		).toBeDisabled();
		const textbox = screen.getByRole('textbox', { name: LABELS.autoReplyMessage });
		await user.clear(textbox);
		await user.paste(userInput);

		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be enabled after editing the auto reply textarea'
		).toBeEnabled();
		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(
			textbox,
			'the auto reply textarea should be restored to its initial value after discarding'
		).toHaveValue(initialValue);
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be disabled again after discarding'
		).toBeDisabled();
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
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be disabled before editing the external sender textarea'
		).toBeDisabled();
		const textbox = screen.getByRole('textbox', {
			name: LABELS.autoReplyMessageExternal
		});
		await user.clear(textbox);
		await user.paste(userInput);

		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be enabled after editing the external sender textarea'
		).toBeEnabled();
		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(
			textbox,
			'the external sender textarea should be restored to its initial value after discarding'
		).toHaveValue(initialValue);
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be disabled again after discarding'
		).toBeDisabled();
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
		expect(
			screen.getByText('Auto'),
			'the initial "Auto" dark mode value should be visible'
		).toBeVisible();
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be disabled before changing the dark mode'
		).toBeDisabled();
		await user.click(screen.getByText('Auto'));
		await user.click(within(screen.getByTestId(TESTID_SELECTORS.dropdown)).getByText(/disabled/i));
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be enabled after changing the dark mode'
		).toBeEnabled();
		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(
			screen.getByText('Auto'),
			'the initial "Auto" dark mode value should be restored after discarding'
		).toBeVisible();
		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should be disabled again after discarding'
		).toBeDisabled();
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

			expect(
				screen.getByText(/dark mode/i),
				'the dark mode section should be visible'
			).toBeVisible();
			const selectSection = screen.getByTestId('select-dark-theme');
			expect(
				within(selectSection).getByText(/invalid option/i),
				'an "invalid option" error should be shown when the dark mode value is undefined'
			).toBeVisible();
			expect(
				within(selectSection).getByText(
					'The current value is not recognized. The interface has defaulted to System theme. Please select a valid option to change the theme.'
				),
				'the dark mode invalid value description should be shown'
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
			expect(
				screen.getByText(/invalid option/i),
				'an "invalid option" error should be shown when the locale value is invalid'
			).toBeVisible();
			expect(
				screen.getByText(
					'The current value is not recognized. The interface has defaulted to English. Please select a valid option.'
				),
				'the locale invalid value description should be shown'
			).toBeVisible();
		});
	});

	describe('Privacy settings', () => {
		it('should be visible if Carbonio is CE', async () => {
			useLoginConfigStore.setState({ isCarbonioCE: true });
			setup(<GeneralSettings />);
			expect(
				screen.getByText('Privacy'),
				'the Privacy section should be visible when Carbonio is CE'
			).toBeVisible();
		});

		it('should not be visible if Carbonio is not CE', () => {
			useLoginConfigStore.setState({ isCarbonioCE: false });
			setup(<GeneralSettings />);
			expect(
				screen.queryByText('Privacy'),
				'the Privacy section should not be rendered when Carbonio is not CE'
			).not.toBeInTheDocument();
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
				),
				'the analytics checkbox should be checked by default when carbonioPrefSendAnalytics is TRUE'
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
					),
					'the analytics checkbox should be unchecked by default when carbonioPrefSendAnalytics is not TRUE'
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
				expect(
					screen.getByRole('button', { name: /discard changes/i }),
					'the discard button should be enabled when the analytics value differs from the initial one'
				).toBeEnabled();
				expect(
					screen.getByRole('button', { name: /save/i }),
					'the save button should be enabled when the analytics value differs from the initial one'
				).toBeEnabled();
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
				expect(
					screen.getByRole('button', { name: /discard changes/i }),
					'the discard button should be enabled after the first toggle'
				).toBeEnabled();
				await user.click(screen.getByText('Allow data analytics'));
				expect(
					screen.getByRole('button', { name: /discard changes/i }),
					'the discard button should be disabled once the analytics value is back to the initial one'
				).toBeDisabled();
				expect(
					screen.getByRole('button', { name: /save/i }),
					'the save button should be disabled once the analytics value is back to the initial one'
				).toBeDisabled();
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
					),
					'the analytics checkbox should be reset to its initial checked state after discarding'
				).toBeVisible()
			);
		});
	});

	describe('User quota section', () => {
		it('should be visible if Carbonio is not CE and totalQuota feature flag is not enabled', () => {
			useLoginConfigStore.setState({ isCarbonioCE: false, featureFlags: { totalQuota: false } });
			setup(<GeneralSettings />);
			expect(
				screen.getByText("User's quota"),
				"the User's quota section should be visible when Carbonio is not CE and the totalQuota flag is disabled"
			).toBeVisible();
		});

		it('should not be visible if Carbonio is CE', () => {
			useLoginConfigStore.setState({ isCarbonioCE: true, featureFlags: { totalQuota: false } });
			setup(<GeneralSettings />);
			expect(
				screen.queryByText("User's quota"),
				"the User's quota section should not be rendered when Carbonio is CE"
			).not.toBeInTheDocument();
		});

		it('should not be visible if totalQuota feature flag is enabled', () => {
			useLoginConfigStore.setState({ isCarbonioCE: false, featureFlags: { totalQuota: true } });
			setup(<GeneralSettings />);
			expect(
				screen.queryByText("User's quota"),
				"the User's quota section should not be rendered when the totalQuota feature flag is enabled"
			).not.toBeInTheDocument();
		});
	});
});
