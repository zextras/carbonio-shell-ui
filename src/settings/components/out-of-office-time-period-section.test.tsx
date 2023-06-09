/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';
import { screen } from '@testing-library/react';
import { format } from 'date-fns';
import { setup } from '../../test/utils';
import { OutOfOfficeTimePeriodSection } from './out-of-office-time-period-section';
import { ICONS } from '../../test/constants';

const DATE_TIME_PICKER_FORMAT = 'MM/dd/yyyy';
describe('out of office time period section', () => {
	test('should render two checkboxes and four date time picker with default values', () => {
		const addMod = jest.fn();
		setup(
			<OutOfOfficeTimePeriodSection
				addMod={addMod}
				disabled={false}
				prefOutOfOfficeFromDate={undefined}
				prefOutOfOfficeUntilDate={undefined}
			/>
		);
		expect(screen.getByText(/all day/i)).toBeVisible();
		expect(screen.getByTestId(ICONS.checkboxUnchecked)).toBeVisible();
		expect(screen.getByText(/start date/i)).toBeVisible();
		expect(screen.getByText(/end date/i)).toBeVisible();
		expect(screen.getByText(/start time/i)).toBeVisible();
		expect(screen.getByText(/end time/i)).toBeVisible();
		expect(screen.getAllByText(format(Date.now(), DATE_TIME_PICKER_FORMAT))).toHaveLength(2);
		expect(screen.getAllByText(format(Date.now(), DATE_TIME_PICKER_FORMAT))[0]).toBeVisible();
		expect(screen.getAllByText(format(Date.now(), DATE_TIME_PICKER_FORMAT))[1]).toBeVisible();
	});
});
