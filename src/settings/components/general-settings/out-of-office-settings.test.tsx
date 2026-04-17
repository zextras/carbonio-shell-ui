/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { act, screen, within } from '@testing-library/react';
import type { AccountSettingsPrefs } from '@zextras/carbonio-ui-soap-lib';
import { forEach } from 'lodash';

import { OutOfOfficeSettings } from './out-of-office-settings';
import { SETTINGS_OUT_OF_OFFICE_TEXT_AREA_MAX_CHAR_LIMIT } from '../../../constants/internal-constants';
import { ICONS, TESTID_SELECTORS } from '../../../tests/constants';
import { setup } from '../../../tests/utils';
import type { AccountSettings } from '../../../types/account';
import type { AddMod } from '../../../types/network';
import { dateToGenTime } from '../utils';

describe('Out of office settings', () => {
	test('render section with defaults', () => {
		const settings: AccountSettings = { prefs: {}, attrs: {}, props: [] };
		const addModFn = vi.fn();
		const removeMod = vi.fn();
		setup(
			<OutOfOfficeSettings
				settings={settings}
				addMod={addModFn}
				removeMod={removeMod}
				setOutOfOfficeError={vi.fn()}
				outOfOfficeError={false}
			/>
		);
		expect(screen.getByText('Out of Office Settings')).toBeVisible();
		expect(screen.getByText('Send auto-reply')).toBeVisible();
		expect(screen.getByTestId(ICONS.switchUnchecked)).toBeVisible();
		expect(screen.getByText('External Senders')).toBeVisible();
		expect(screen.getByRole('textbox', { name: 'Auto-Reply Message:' })).toBeVisible();
		expect(screen.getByText("Don't send an auto-reply message to external sender")).toBeVisible();
		expect(screen.getByText('Time Period')).toBeVisible();
		expect(screen.getByText('Send auto-replies during the following period:')).toBeVisible();
		expect(screen.getByText('All Day:')).toBeVisible();
		expect(screen.getAllByTestId(ICONS.checkboxUnchecked)).toHaveLength(2);
		expect(screen.getAllByTestId(ICONS.checkboxUnchecked)[0]).toBeVisible();
		expect(screen.getAllByTestId(ICONS.checkboxUnchecked)[1]).toBeVisible();
	});

	test('by default is unchecked', () => {
		const settings: AccountSettings = { prefs: {}, attrs: {}, props: [] };
		const addModFn = vi.fn();
		const removeMod = vi.fn();
		setup(
			<OutOfOfficeSettings
				settings={settings}
				addMod={addModFn}
				removeMod={removeMod}
				setOutOfOfficeError={vi.fn()}
				outOfOfficeError={false}
			/>
		);
		expect(screen.getByTestId(ICONS.switchUnchecked)).toBeVisible();
	});

	test('formSubSection Time Period is disabled when the switch is unchecked', () => {
		const settings: AccountSettings = { prefs: {}, attrs: {}, props: [] };
		const addModFn = vi.fn();
		const removeMod = vi.fn();
		setup(
			<OutOfOfficeSettings
				settings={settings}
				addMod={addModFn}
				removeMod={removeMod}
				setOutOfOfficeError={vi.fn()}
				outOfOfficeError={false}
			/>
		);
		expect(screen.getByText('Time Period')).toHaveStyle('color : #cccccc');
	});

	test('formSubSection Time Period is not disabled when the switch is checked', () => {
		const settings: AccountSettings = {
			prefs: { zimbraPrefOutOfOfficeReplyEnabled: 'TRUE' },
			attrs: {},
			props: []
		};
		const addModFn = vi.fn();
		const removeMod = vi.fn();
		setup(
			<OutOfOfficeSettings
				settings={settings}
				addMod={addModFn}
				removeMod={removeMod}
				setOutOfOfficeError={vi.fn()}
				outOfOfficeError={false}
			/>
		);
		expect(screen.getByText('Time Period')).toHaveStyle('color : #333333');
	});

	test('click on the unchecked switch updates the pref outOfOfficeReplyEnabled to TRUE', async () => {
		const settings: AccountSettings = { prefs: {}, attrs: {}, props: [] };
		const addModFn = vi.fn();
		const removeMod = vi.fn();
		const { user } = setup(
			<OutOfOfficeSettings
				settings={settings}
				addMod={addModFn}
				removeMod={removeMod}
				setOutOfOfficeError={vi.fn()}
				outOfOfficeError={false}
			/>
		);
		await user.click(screen.getByTestId(ICONS.switchUnchecked));
		expect(addModFn).toHaveBeenCalledWith<Parameters<AddMod>>(
			'prefs',
			'zimbraPrefOutOfOfficeReplyEnabled',
			'TRUE'
		);
	});

	test('click on the checked switch updates the pref outOfOfficeReplyEnabled to FALSE', async () => {
		const settings: AccountSettings = {
			prefs: { zimbraPrefOutOfOfficeReplyEnabled: 'TRUE' },
			attrs: {},
			props: []
		};
		const addModFn = vi.fn();
		const removeMod = vi.fn();
		const { user } = setup(
			<OutOfOfficeSettings
				settings={settings}
				addMod={addModFn}
				removeMod={removeMod}
				setOutOfOfficeError={vi.fn()}
				outOfOfficeError={false}
			/>
		);
		await user.click(screen.getByTestId(ICONS.switchChecked));
		expect(addModFn).toHaveBeenCalledWith<Parameters<AddMod>>(
			'prefs',
			'zimbraPrefOutOfOfficeReplyEnabled',
			'FALSE'
		);
	});

	test('click on the unchecked switch enables both inputs for reply message and check for time period', async () => {
		const settings: AccountSettings = {
			prefs: {
				zimbraPrefExternalSendersType: 'ALL',
				zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE'
			},
			attrs: {},
			props: []
		};
		const addModFn = vi.fn();
		const removeMod = vi.fn();
		const { user } = setup(
			<OutOfOfficeSettings
				settings={settings}
				addMod={addModFn}
				removeMod={removeMod}
				setOutOfOfficeError={vi.fn()}
				outOfOfficeError={false}
			/>
		);
		await user.click(screen.getByTestId(ICONS.switchUnchecked));
		expect(screen.getByRole('textbox', { name: 'Auto-Reply Message:' })).toBeEnabled();
		expect(
			screen.getByRole('textbox', { name: 'Auto-Reply Message for External senders:' })
		).toBeEnabled();

		expect(screen.getByText('Send auto-replies during the following period:')).not.toHaveAttribute(
			'disabled'
		);
	});

	test('click on the checked switch disables all fields', async () => {
		const settings: AccountSettings = {
			prefs: {
				zimbraPrefOutOfOfficeReplyEnabled: 'TRUE',
				zimbraPrefExternalSendersType: 'ALL',
				zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE',
				zimbraPrefOutOfOfficeFromDate: dateToGenTime(new Date()),
				zimbraPrefOutOfOfficeUntilDate: dateToGenTime(new Date())
			},
			attrs: {},
			props: []
		};
		const addModFn = vi.fn();
		const removeMod = vi.fn();
		const { user } = setup(
			<OutOfOfficeSettings
				settings={settings}
				addMod={addModFn}
				removeMod={removeMod}
				setOutOfOfficeError={vi.fn()}
				outOfOfficeError={false}
			/>
		);
		await user.click(screen.getByTestId(ICONS.switchChecked));
		// TODO The disabled attribute is not available on divs. Re-enable the check once the checkbox will be a proper html element
		// expect(screen.getByText('Send auto-replies during the following period:')).toHaveAttribute(
		// 	'disabled'
		// );
		// expect(screen.getByText('All Day:')).toHaveAttribute('disabled');
		const inputFields = screen.getAllByRole('textbox');
		expect(inputFields).toHaveLength(6);
		inputFields.forEach((field) => expect(field).toBeDisabled());
	});

	test('all day check and datetime inputs do not become enabled if user select "send auto-replies", but the time period check is not checked', async () => {
		const settings: AccountSettings = {
			prefs: {},
			attrs: {},
			props: []
		};
		const addModFn = vi.fn();
		const removeMod = vi.fn();
		const { user } = setup(
			<OutOfOfficeSettings
				settings={settings}
				addMod={addModFn}
				removeMod={removeMod}
				setOutOfOfficeError={vi.fn()}
				outOfOfficeError={false}
			/>
		);
		await user.click(screen.getByTestId(ICONS.switchUnchecked));
		// TODO The disabled attribute is not available on divs. Re-enable the check once the checkbox will be a proper html element
		// expect(screen.getByText('Send auto-replies during the following period:')).not.toHaveAttribute(
		// 	'disabled'
		// );
		// expect(screen.getByText('All Day:')).toHaveAttribute('disabled');
		const dateTimeInputs = screen.getAllByRole('textbox', { name: /(start|end) (date|time)/i });
		expect(dateTimeInputs).toHaveLength(4);
		dateTimeInputs.forEach((input) => expect(input).toBeDisabled());
	});

	test.each<[string, AccountSettingsPrefs]>([
		[
			'Send standard auto-reply message',
			{
				zimbraPrefOutOfOfficeSuppressExternalReply: 'FALSE',
				zimbraPrefOutOfOfficeExternalReplyEnabled: 'FALSE'
			}
		],
		[
			'Send custom message to those who are not in my organization',
			{
				zimbraPrefExternalSendersType: 'ALL',
				zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE'
			}
		],
		[
			'Send custom message to those who are not in my organization or address book',
			{
				zimbraPrefExternalSendersType: 'ALLNOTINAB',
				zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE'
			}
		],
		[
			"Don't send an auto-reply message to external sender",
			{
				zimbraPrefOutOfOfficeSuppressExternalReply: 'TRUE'
			}
		]
	])('external reply initial value is %s', (expected, initialPrefs) => {
		const settings: AccountSettings = {
			prefs: initialPrefs,
			attrs: {},
			props: []
		};
		const addModFn = vi.fn();
		const removeMod = vi.fn();
		setup(
			<OutOfOfficeSettings
				settings={settings}
				addMod={addModFn}
				removeMod={removeMod}
				setOutOfOfficeError={vi.fn()}
				outOfOfficeError={false}
			/>
		);
		expect(screen.getByText(expected)).toBeVisible();
	});

	test.each([
		'Send standard auto-reply message',
		"Don't send an auto-reply message to external sender"
	])(
		'input of auto-reply message for external senders is hidden if external senders option is set to %s',
		async (optionLabel) => {
			const settings: AccountSettings = {
				prefs: {
					zimbraPrefOutOfOfficeReplyEnabled: 'TRUE',
					zimbraPrefExternalSendersType: 'ALL',
					zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE'
				},
				attrs: {},
				props: []
			};
			const addModFn = vi.fn();
			const removeMod = vi.fn();
			const { user } = setup(
				<OutOfOfficeSettings
					settings={settings}
					addMod={addModFn}
					removeMod={removeMod}
					setOutOfOfficeError={vi.fn()}
					outOfOfficeError={false}
				/>
			);
			await user.click(screen.getByText('External Senders'));
			await user.click(
				within(screen.getByTestId(TESTID_SELECTORS.dropdown)).getByText(optionLabel)
			);
			expect(
				screen.queryByRole('textbox', { name: /auto-reply message for external senders/i })
			).not.toBeInTheDocument();
		}
	);

	test.each([
		'Send custom message to those who are not in my organization',
		'Send custom message to those who are not in my organization or address book'
	])(
		'input of auto-reply message for external senders is visible if external senders option is set to %s',
		async (optionLabel) => {
			const settings: AccountSettings = {
				prefs: {
					zimbraPrefOutOfOfficeReplyEnabled: 'TRUE'
				},
				attrs: {},
				props: []
			};
			const addModFn = vi.fn();
			const removeMod = vi.fn();
			const { user } = setup(
				<OutOfOfficeSettings
					settings={settings}
					addMod={addModFn}
					removeMod={removeMod}
					setOutOfOfficeError={vi.fn()}
					outOfOfficeError={false}
				/>
			);
			await user.click(screen.getByText('External Senders'));
			await user.click(
				within(screen.getByTestId(TESTID_SELECTORS.dropdown)).getByText(optionLabel)
			);
			expect(
				screen.getByRole('textbox', { name: /auto-reply message for external senders/i })
			).toBeVisible();
		}
	);

	test.each<[string, AccountSettingsPrefs, AccountSettingsPrefs]>([
		[
			'Send standard auto-reply message',
			{
				zimbraPrefExternalSendersType: 'INSD',
				zimbraPrefOutOfOfficeExternalReplyEnabled: 'FALSE',
				zimbraPrefOutOfOfficeSuppressExternalReply: 'FALSE'
			},
			{
				zimbraPrefExternalSendersType: 'ALL',
				zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE'
			}
		],
		[
			'Send custom message to those who are not in my organization',
			{
				zimbraPrefExternalSendersType: 'ALL',
				zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE',
				zimbraPrefOutOfOfficeSuppressExternalReply: 'FALSE'
			},
			{}
		],
		[
			'Send custom message to those who are not in my organization or address book',
			{
				zimbraPrefExternalSendersType: 'ALLNOTINAB',
				zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE',
				zimbraPrefOutOfOfficeSuppressExternalReply: 'FALSE'
			},
			{}
		],
		[
			"Don't send an auto-reply message to external sender",
			{
				zimbraPrefExternalSendersType: 'INAB',
				zimbraPrefOutOfOfficeExternalReplyEnabled: 'FALSE',
				zimbraPrefOutOfOfficeSuppressExternalReply: 'TRUE'
			},
			{
				zimbraPrefExternalSendersType: 'ALL',
				zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE'
			}
		]
	])(
		'select of option %s updates the prefs %j',
		async (optionLabel, updatedPrefs, initialPrefs) => {
			const settings: AccountSettings = {
				prefs: {
					zimbraPrefOutOfOfficeReplyEnabled: 'TRUE',
					...initialPrefs
				},
				attrs: {},
				props: []
			};
			const addModFn = vi.fn();
			const removeMod = vi.fn();
			const { user } = setup(
				<OutOfOfficeSettings
					settings={settings}
					addMod={addModFn}
					removeMod={removeMod}
					setOutOfOfficeError={vi.fn()}
					outOfOfficeError={false}
				/>
			);
			await user.click(screen.getByText('External Senders'));
			await user.click(
				within(screen.getByTestId(TESTID_SELECTORS.dropdown)).getByText(optionLabel)
			);
			forEach(updatedPrefs, (value, key) =>
				expect(addModFn).toHaveBeenCalledWith<Parameters<AddMod>>('prefs', key, value)
			);
		}
	);

	test('should update zimbraPrefOutOfOfficeReply when reply message change', async () => {
		const settings: AccountSettings = {
			prefs: {
				zimbraPrefOutOfOfficeReplyEnabled: 'TRUE'
			},
			attrs: {},
			props: []
		};
		const addModFn = vi.fn();
		const removeMod = vi.fn();
		const { user } = setup(
			<OutOfOfficeSettings
				settings={settings}
				addMod={addModFn}
				removeMod={removeMod}
				setOutOfOfficeError={vi.fn()}
				outOfOfficeError={false}
			/>
		);
		const message = faker.lorem.words(3);
		await user.type(screen.getByRole('textbox', { name: 'Auto-Reply Message:' }), message);
		expect(addModFn).toHaveBeenCalledWith<Parameters<AddMod>>(
			'prefs',
			'zimbraPrefOutOfOfficeReply',
			message
		);
	});

	test('should update zimbraPrefOutOfOfficeExternalReply when external reply message change', async () => {
		const settings: AccountSettings = {
			prefs: {
				zimbraPrefOutOfOfficeReplyEnabled: 'TRUE',
				zimbraPrefExternalSendersType: 'ALL',
				zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE'
			},
			attrs: {},
			props: []
		};
		const addModFn = vi.fn();
		const removeMod = vi.fn();
		const { user } = setup(
			<OutOfOfficeSettings
				settings={settings}
				addMod={addModFn}
				removeMod={removeMod}
				setOutOfOfficeError={vi.fn()}
				outOfOfficeError={false}
			/>
		);
		const message = faker.lorem.words(3);
		await user.type(
			screen.getByRole('textbox', { name: 'Auto-Reply Message for External senders:' }),
			message
		);
		expect(addModFn).toHaveBeenCalledWith<Parameters<AddMod>>(
			'prefs',
			'zimbraPrefOutOfOfficeExternalReply',
			message
		);
	});
	test.each<string>(['Auto-Reply Message:', 'Auto-Reply Message for External senders:'])(
		'Textarea should show characters counter',
		async (textAreaLabel) => {
			const settings: AccountSettings = {
				prefs: {
					zimbraPrefOutOfOfficeReplyEnabled: 'TRUE',
					zimbraPrefExternalSendersType: 'ALL',
					zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE'
				},
				attrs: {},
				props: []
			};
			const addModFn = vi.fn();
			const removeMod = vi.fn();
			const { user } = setup(
				<OutOfOfficeSettings
					settings={settings}
					addMod={addModFn}
					removeMod={removeMod}
					setOutOfOfficeError={vi.fn()}
					outOfOfficeError={false}
				/>
			);
			const message = faker.lorem.word(5);
			await act(async () => {
				screen.getByRole('textbox', { name: textAreaLabel }).focus();
				await user.paste(message);
			});
			expect(
				screen.getByText(`5/${SETTINGS_OUT_OF_OFFICE_TEXT_AREA_MAX_CHAR_LIMIT}`)
			).toBeVisible();
		}
	);

	test.each<string>(['Auto-Reply Message:', 'Auto-Reply Message for External senders:'])(
		'Textarea should show an error when character limit is reached',
		async (textAreaLabel) => {
			const settings: AccountSettings = {
				prefs: {
					zimbraPrefOutOfOfficeReplyEnabled: 'TRUE',
					zimbraPrefExternalSendersType: 'ALL',
					zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE'
				},
				attrs: {},
				props: []
			};
			const addModFn = vi.fn();
			const removeMod = vi.fn();
			const { user } = setup(
				<OutOfOfficeSettings
					settings={settings}
					addMod={addModFn}
					removeMod={removeMod}
					setOutOfOfficeError={vi.fn()}
					outOfOfficeError={false}
				/>
			);
			const message = faker.string.sample(SETTINGS_OUT_OF_OFFICE_TEXT_AREA_MAX_CHAR_LIMIT + 1);
			await act(async () => {
				screen.getByRole('textbox', { name: textAreaLabel }).focus();
				await user.paste(message);
			});
			const errorMessage = /You've exceeded the character limit. Please shorten your text./i;
			expect(screen.getByText(errorMessage)).toBeVisible();
		}
	);

	test.each<string>(['Auto-Reply Message:', 'Auto-Reply Message for External senders:'])(
		'It should set the error when character limit is reached',
		async (textAreaLabel) => {
			const settings: AccountSettings = {
				prefs: {
					zimbraPrefOutOfOfficeReplyEnabled: 'TRUE',
					zimbraPrefExternalSendersType: 'ALL',
					zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE'
				},
				attrs: {},
				props: []
			};
			const addModFn = vi.fn();
			const removeMod = vi.fn();
			const setError = vi.fn();

			const { user } = setup(
				<OutOfOfficeSettings
					settings={settings}
					addMod={addModFn}
					removeMod={removeMod}
					setOutOfOfficeError={setError}
					outOfOfficeError={false}
				/>
			);
			const message = faker.string.sample(SETTINGS_OUT_OF_OFFICE_TEXT_AREA_MAX_CHAR_LIMIT + 1);
			await act(async () => {
				screen.getByRole('textbox', { name: textAreaLabel }).focus();
				await user.paste(message);
			});
			expect(setError).toHaveBeenCalledTimes(1);
			expect(setError).toHaveBeenCalledWith(true);
		}
	);

	test.each<string>(['Auto-Reply Message:', 'Auto-Reply Message for External senders:'])(
		'It should unset the error when character is within the limit',
		async (textAreaLabel) => {
			const settings: AccountSettings = {
				prefs: {
					zimbraPrefOutOfOfficeReplyEnabled: 'TRUE',
					[textAreaLabel]: faker.string.sample(SETTINGS_OUT_OF_OFFICE_TEXT_AREA_MAX_CHAR_LIMIT + 1),
					zimbraPrefExternalSendersType: 'ALL',
					zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE'
				},
				attrs: {},
				props: []
			};
			const addModFn = vi.fn();
			const removeMod = vi.fn();
			const setError = vi.fn();

			const { user } = setup(
				<OutOfOfficeSettings
					settings={settings}
					addMod={addModFn}
					removeMod={removeMod}
					setOutOfOfficeError={setError}
					outOfOfficeError
				/>
			);
			await act(async () => {
				screen.getByRole('textbox', { name: textAreaLabel }).focus();
				await user.keyboard('Delete');
			});
			expect(setError).toHaveBeenCalledTimes(1);
			expect(setError).toHaveBeenCalledWith(false);
		}
	);

	test('should set zimbraPrefOutOfOfficeFromDate and zimbraPrefOutOfOfficeUntilDate to empty value when user unchecks time period setting', async () => {
		const settings: AccountSettings = {
			prefs: {
				zimbraPrefOutOfOfficeReplyEnabled: 'TRUE',
				zimbraPrefOutOfOfficeFromDate: dateToGenTime(faker.date.recent()),
				zimbraPrefOutOfOfficeUntilDate: dateToGenTime(faker.date.soon())
			},
			attrs: {},
			props: []
		};
		const addModFn = vi.fn();
		const removeMod = vi.fn();
		const { user } = setup(
			<OutOfOfficeSettings
				settings={settings}
				addMod={addModFn}
				removeMod={removeMod}
				setOutOfOfficeError={vi.fn()}
				outOfOfficeError={false}
			/>
		);
		await act(async () => {
			await user.click(screen.getByText(/Send auto-replies during the following period/i));
		});
		expect(addModFn).toHaveBeenCalledWith<Parameters<AddMod>>(
			'prefs',
			'zimbraPrefOutOfOfficeFromDate',
			''
		);
		expect(addModFn).toHaveBeenCalledWith<Parameters<AddMod>>(
			'prefs',
			'zimbraPrefOutOfOfficeUntilDate',
			''
		);
	});

	test('should set zimbraPrefOutOfOfficeFromDate and zimbraPrefOutOfOfficeUntilDate if not already valued when user unchecks time period setting', async () => {
		const settings: AccountSettings = {
			prefs: {
				zimbraPrefOutOfOfficeReplyEnabled: 'TRUE'
			},
			attrs: {},
			props: []
		};
		const addModFn = vi.fn();
		const removeMod = vi.fn();
		const { user } = setup(
			<OutOfOfficeSettings
				settings={settings}
				addMod={addModFn}
				removeMod={removeMod}
				setOutOfOfficeError={vi.fn()}
				outOfOfficeError={false}
			/>
		);
		await act(async () => {
			await user.click(screen.getByText(/Send auto-replies during the following period/i));
		});
		const now = dateToGenTime(new Date(new Date().setSeconds(0, 0)));
		expect(addModFn).toHaveBeenCalledWith<Parameters<AddMod>>(
			'prefs',
			'zimbraPrefOutOfOfficeFromDate',
			now
		);
		expect(addModFn).toHaveBeenCalledWith<Parameters<AddMod>>(
			'prefs',
			'zimbraPrefOutOfOfficeUntilDate',
			now
		);
	});

	test('should not set zimbraPrefOutOfOfficeFromDate and zimbraPrefOutOfOfficeUntilDate if already valued when user unchecks time period setting', async () => {
		const settings: AccountSettings = {
			prefs: {
				zimbraPrefOutOfOfficeReplyEnabled: 'TRUE',
				zimbraPrefOutOfOfficeFromDate: dateToGenTime(faker.date.recent())
			},
			attrs: {},
			props: []
		};
		const addModFn = vi.fn();
		const removeMod = vi.fn();
		const { user } = setup(
			<OutOfOfficeSettings
				settings={settings}
				addMod={addModFn}
				removeMod={removeMod}
				setOutOfOfficeError={vi.fn()}
				outOfOfficeError={false}
			/>
		);
		await act(async () => {
			await user.click(screen.getByText(/Send auto-replies during the following period/i));
		});
		const now = dateToGenTime(new Date(new Date().setSeconds(0, 0)));
		expect(addModFn).toHaveBeenCalledTimes(1);
		expect(addModFn).toHaveBeenCalledWith<Parameters<AddMod>>(
			'prefs',
			'zimbraPrefOutOfOfficeUntilDate',
			now
		);
	});
});
