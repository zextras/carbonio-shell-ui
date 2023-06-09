/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';
import { screen, within } from '@testing-library/react';
import { forEach } from 'lodash';
import { setup } from '../../../test/utils';
import { OutOfOfficeView } from './out-of-office-view';
import { AccountSettings, AccountSettingsPrefs } from '../../../../types';
import { ICONS, TESTID_SELECTORS } from '../../../test/constants';
import { dateToGenTime } from '../utils';

describe('Out of office view', () => {
	test('render section with defaults', () => {
		const settings: AccountSettings = { prefs: {}, attrs: {}, props: [] };
		const addModFn = jest.fn();
		setup(<OutOfOfficeView settings={settings} addMod={addModFn} />);
		expect(screen.getByText('Out of Office Settings')).toBeVisible();
		expect(screen.getByText('Out of Office')).toBeVisible();
		expect(screen.getByText('Do not send auto-replies')).toBeVisible();
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

	test('by default is set to not send auto-replies', () => {
		const settings: AccountSettings = { prefs: {}, attrs: {}, props: [] };
		const addModFn = jest.fn();
		setup(<OutOfOfficeView settings={settings} addMod={addModFn} />);
		expect(screen.getByText('Do not send auto-replies')).toBeVisible();
	});

	test('select of send auto-replies option updates the pref outOfOfficeReplyEnabled to TRUE', async () => {
		const settings: AccountSettings = { prefs: {}, attrs: {}, props: [] };
		const addModFn = jest.fn();
		const { user } = setup(<OutOfOfficeView settings={settings} addMod={addModFn} />);
		await user.click(screen.getByText('Do not send auto-replies'));
		await user.click(screen.getByText('Send auto-replies'));
		expect(addModFn).toHaveBeenCalledWith('prefs', 'zimbraPrefOutOfOfficeReplyEnabled', 'TRUE');
	});

	test('select of send auto-replies option updates the pref outOfOfficeReplyEnabled to FALSE', async () => {
		const settings: AccountSettings = {
			prefs: { zimbraPrefOutOfOfficeReplyEnabled: 'TRUE' },
			attrs: {},
			props: []
		};
		const addModFn = jest.fn();
		const { user } = setup(<OutOfOfficeView settings={settings} addMod={addModFn} />);
		await user.click(screen.getByText('Send auto-replies'));
		await user.click(screen.getByText('Do not send auto-replies'));
		expect(addModFn).toHaveBeenCalledWith('prefs', 'zimbraPrefOutOfOfficeReplyEnabled', 'FALSE');
	});

	test('send auto-replies option enables both inputs for reply message and check for time period', async () => {
		const settings: AccountSettings = {
			prefs: {
				zimbraPrefExternalSendersType: 'ALL',
				zimbraPrefOutOfOfficeExternalReplyEnabled: 'TRUE'
			},
			attrs: {},
			props: []
		};
		const addModFn = jest.fn();
		const { user } = setup(<OutOfOfficeView settings={settings} addMod={addModFn} />);
		await user.click(screen.getByText('Do not send auto-replies'));
		await user.click(screen.getByText('Send auto-replies'));
		expect(screen.getByRole('textbox', { name: 'Auto-Reply Message:' })).toBeEnabled();
		expect(
			screen.getByRole('textbox', { name: 'Auto-Reply Message for External senders:' })
		).toBeEnabled();

		expect(screen.getByText('Send auto-replies during the following period:')).not.toHaveAttribute(
			'disabled'
		);
	});

	test('do not send auto-replies option disables both inputs for reply message and checks of time period section', async () => {
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
		const addModFn = jest.fn();
		const { user } = setup(<OutOfOfficeView settings={settings} addMod={addModFn} />);
		await user.click(screen.getByText('Send auto-replies'));
		await user.click(screen.getByText('Do not send auto-replies'));
		expect(screen.getByRole('textbox', { name: 'Auto-Reply Message:' })).toBeDisabled();
		expect(
			screen.getByRole('textbox', { name: 'Auto-Reply Message for External senders:' })
		).toBeDisabled();

		expect(screen.getByText('Send auto-replies during the following period:')).toHaveAttribute(
			'disabled'
		);
		expect(screen.getByText('All Day:')).toHaveAttribute('disabled');
	});

	test('all day check does not become enabled is user select "send auto-replies", but the time period check is not checked', async () => {
		const settings: AccountSettings = {
			prefs: {},
			attrs: {},
			props: []
		};
		const addModFn = jest.fn();
		const { user } = setup(<OutOfOfficeView settings={settings} addMod={addModFn} />);
		await user.click(screen.getByText('Do not send auto-replies'));
		await user.click(screen.getByText('Send auto-replies'));
		expect(screen.getByText('Send auto-replies during the following period:')).not.toHaveAttribute(
			'disabled'
		);
		expect(screen.getByText('All Day:')).toHaveAttribute('disabled');
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
			const addModFn = jest.fn();
			const { user } = setup(<OutOfOfficeView settings={settings} addMod={addModFn} />);
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
			const addModFn = jest.fn();
			const { user } = setup(<OutOfOfficeView settings={settings} addMod={addModFn} />);
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
			const addModFn = jest.fn();
			const { user } = setup(<OutOfOfficeView settings={settings} addMod={addModFn} />);
			await user.click(screen.getByText('External Senders'));
			await user.click(
				within(screen.getByTestId(TESTID_SELECTORS.dropdown)).getByText(optionLabel)
			);
			forEach(updatedPrefs, (value, key) =>
				expect(addModFn).toHaveBeenCalledWith('prefs', key, value)
			);
		}
	);
});
