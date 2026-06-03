/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { act, screen } from '@testing-library/react';
import { format, addDays, subDays, startOfDay, endOfDay, addHours, subHours } from 'date-fns';

import { OutOfOfficeTimePeriodSection } from './out-of-office-time-period-section';
import { ICONS } from '../../../tests/constants';
import { setup } from '../../../tests/utils';
import { dateToGenTime } from '../utils';

describe('out of office time period section', () => {
	test('should render the section with default values', () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		setup(
			<OutOfOfficeTimePeriodSection
				addMod={addMod}
				removeMod={removeMod}
				disabled={false}
				prefOutOfOfficeFromDate={undefined}
				prefOutOfOfficeUntilDate={undefined}
			/>
		);
		expect(screen.getByText(/all day/i), 'the All Day label should be visible').toBeVisible();
		expect(
			screen.getByTestId(ICONS.checkboxUnchecked),
			'the All Day checkbox should be unchecked by default'
		).toBeVisible();
		expect(screen.getByText(/start date/i), 'the start date label should be visible').toBeVisible();
		expect(screen.getByText(/end date/i), 'the end date label should be visible').toBeVisible();
		expect(screen.getByText(/start time/i), 'the start time label should be visible').toBeVisible();
		expect(screen.getByText(/end time/i), 'the end time label should be visible').toBeVisible();
		expect(
			screen.getByRole('textbox', { name: /start date/i }),
			'the start date should default to today when no pref is provided'
		).toHaveDisplayValue(format(Date.now(), 'P'));
		expect(
			screen.getByRole('textbox', { name: /end date/i }),
			'the end date should default to today when no pref is provided'
		).toHaveDisplayValue(format(Date.now(), 'P'));
		expect(
			screen.getByRole('textbox', { name: /start time/i }),
			'the start time should default to now when no pref is provided'
		).toHaveDisplayValue(format(Date.now(), 'p'));
		expect(
			screen.getByRole('textbox', { name: /end time/i }),
			'the end time should default to now when no pref is provided'
		).toHaveDisplayValue(format(Date.now(), 'p'));
	});

	test('should show the date received from pref if valued', () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		setup(
			<OutOfOfficeTimePeriodSection
				addMod={addMod}
				removeMod={removeMod}
				disabled={false}
				prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
				prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
			/>
		);
		expect(
			screen.getByRole('textbox', { name: /start date/i }),
			'the start date should display the from date pref value'
		).toHaveDisplayValue(format(fromDate, 'P'));
		expect(
			screen.getByRole('textbox', { name: /end date/i }),
			'the end date should display the until date pref value'
		).toHaveDisplayValue(format(untilDate, 'P'));
		expect(
			screen.getByRole('textbox', { name: /start time/i }),
			'the start time should display the from date pref value'
		).toHaveDisplayValue(format(fromDate, 'p'));
		expect(
			screen.getByRole('textbox', { name: /end time/i }),
			'the end time should display the until date pref value'
		).toHaveDisplayValue(format(untilDate, 'p'));
	});

	test.each(['start date', 'end date', 'start time', 'end time'])(
		'should set the previous value if the user clears the input of the %s',
		async (inputName) => {
			const addMod = vi.fn();
			const removeMod = vi.fn();
			const fromDate = faker.date.recent();
			const untilDate = faker.date.soon();
			const { user } = setup(
				<>
					<span>Click to blur</span>
					<OutOfOfficeTimePeriodSection
						addMod={addMod}
						removeMod={removeMod}
						disabled={false}
						prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
						prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
					/>
				</>
			);
			const dateInput = screen.getByRole<HTMLInputElement>('textbox', {
				name: RegExp(inputName, 'i')
			});
			const initialDisplayValue = dateInput.value;
			await user.clear(dateInput);
			await user.click(screen.getByText(/click to blur/i));
			await act(async () => {
				// to let floating finish the update
				await vi.advanceTimersToNextTimerAsync();
			});
			expect(
				dateInput,
				`clearing the ${inputName} input should restore its previous value on blur`
			).toHaveDisplayValue(initialDisplayValue);
		}
	);

	test('should let the user choose a from date from the picker', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<OutOfOfficeTimePeriodSection
				addMod={addMod}
				removeMod={removeMod}
				disabled={false}
				prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
				prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
			/>
		);
		const fromDateInput = screen.getByRole('textbox', { name: /start date/i });
		const firstOfPreviousMonth = new Date(fromDate);
		firstOfPreviousMonth.setDate(1);
		firstOfPreviousMonth.setMonth(fromDate.getMonth() - 1);
		await user.click(fromDateInput);
		await user.click(screen.getByRole('button', { name: /previous month/i }));
		await user.click(
			screen.getByRole('option', {
				name: RegExp(`choose ${format(firstOfPreviousMonth, 'PPPP')}`, 'i')
			})
		);
		expect(
			screen.queryByRole('button', { name: /previous month/i }),
			'the date picker should close after choosing a date'
		).not.toBeInTheDocument();
		expect(
			fromDateInput,
			'the start date should show the chosen first day of the previous month'
		).toHaveDisplayValue(format(firstOfPreviousMonth, 'P'));
	});

	test('should let the user type a from date', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<>
				<span>Click to blur</span>
				<OutOfOfficeTimePeriodSection
					addMod={addMod}
					removeMod={removeMod}
					disabled={false}
					prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
					prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
				/>
			</>
		);
		const fromDateInput = screen.getByRole<HTMLInputElement>('textbox', { name: /start date/i });
		const firstOfPreviousMonth = new Date(fromDate);
		firstOfPreviousMonth.setDate(1);
		firstOfPreviousMonth.setMonth(fromDate.getMonth() - 1);
		await user.clear(fromDateInput);
		await user.type(fromDateInput, format(firstOfPreviousMonth, 'P'), {
			skipClick: true
		});
		await user.click(screen.getByText(/click to blur/i));
		await act(async () => {
			// to let floating finish the update
			await vi.advanceTimersToNextTimerAsync();
		});
		expect(
			screen.queryByRole('button', { name: /previous month/i }),
			'the date picker should not be open after typing the date'
		).not.toBeInTheDocument();
		expect(
			fromDateInput,
			'the start date should show the typed first day of the previous month'
		).toHaveDisplayValue(format(firstOfPreviousMonth, 'P'));
	});

	test('should let the user choose a from time from the picker', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<OutOfOfficeTimePeriodSection
				addMod={addMod}
				removeMod={removeMod}
				disabled={false}
				prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
				prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
			/>
		);
		const fromTimeInput = screen.getByRole('textbox', { name: /start time/i });
		const newTime = subHours(fromDate, 5);
		newTime.setMinutes(15);
		await user.click(fromTimeInput);
		await user.click(screen.getByText(format(newTime, 'p')));
		expect(
			screen.queryByRole('listitem'),
			'the time picker dropdown should close after choosing a time'
		).not.toBeInTheDocument();
		expect(fromTimeInput, 'the start time should show the chosen time').toHaveDisplayValue(
			format(newTime, 'p')
		);
	});

	test('should let the user type a from time', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<>
				<span>Click to blur</span>
				<OutOfOfficeTimePeriodSection
					addMod={addMod}
					removeMod={removeMod}
					disabled={false}
					prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
					prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
				/>
			</>
		);
		const fromTimeInput = screen.getByRole('textbox', { name: /start time/i });
		const newTime = subHours(fromDate, 5);
		newTime.setMinutes(15);
		await user.clear(fromTimeInput);
		await user.type(fromTimeInput, format(newTime, 'p'), { skipClick: true });
		await user.click(screen.getByText(/click to blur/i));
		await act(async () => {
			// to let floating finish the update
			await vi.advanceTimersToNextTimerAsync();
		});
		expect(
			screen.queryByRole('option'),
			'the time picker should not be open after typing the time'
		).not.toBeInTheDocument();
		expect(fromTimeInput, 'the start time should show the typed time').toHaveDisplayValue(
			format(newTime, 'p')
		);
	});

	test('should let the user choose an until date from the picker', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<OutOfOfficeTimePeriodSection
				addMod={addMod}
				removeMod={removeMod}
				disabled={false}
				prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
				prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
			/>
		);
		const untilDateInput = screen.getByRole('textbox', { name: /end date/i });
		const firstOfNextMonth = new Date(untilDate);
		firstOfNextMonth.setDate(1);
		firstOfNextMonth.setMonth(untilDate.getMonth() + 1);
		await user.click(untilDateInput);
		await user.click(screen.getByRole('button', { name: /next month/i }));
		await user.click(
			screen.getByRole('option', {
				name: RegExp(`choose ${format(firstOfNextMonth, 'PPPP')}`, 'i')
			})
		);
		expect(
			screen.queryByRole('button', { name: /previous month/i }),
			'the date picker should close after choosing the until date'
		).not.toBeInTheDocument();
		expect(
			untilDateInput,
			'the end date should show the chosen first day of the next month'
		).toHaveDisplayValue(format(firstOfNextMonth, 'P'));
	});

	test('should let the user type an until date', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<>
				<span>Click to blur</span>
				<OutOfOfficeTimePeriodSection
					addMod={addMod}
					removeMod={removeMod}
					disabled={false}
					prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
					prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
				/>
			</>
		);
		const untilDateInput = screen.getByRole('textbox', { name: /end date/i });
		const firstOfNextMonth = new Date(untilDate);
		firstOfNextMonth.setDate(1);
		firstOfNextMonth.setMonth(untilDate.getMonth() + 1);
		await user.clear(untilDateInput);
		await user.type(untilDateInput, format(firstOfNextMonth, 'P'), { skipClick: true });
		await user.click(screen.getByText(/click to blur/i));
		await act(async () => {
			// to let floating finish the update
			await vi.advanceTimersToNextTimerAsync();
		});
		expect(
			screen.queryByRole('button', { name: /previous month/i }),
			'the date picker should not be open after typing the until date'
		).not.toBeInTheDocument();
		expect(
			untilDateInput,
			'the end date should show the typed first day of the next month'
		).toHaveDisplayValue(format(firstOfNextMonth, 'P'));
	});

	test('should let the user choose an until time from the picker', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<OutOfOfficeTimePeriodSection
				addMod={addMod}
				removeMod={removeMod}
				disabled={false}
				prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
				prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
			/>
		);
		const utilTimeInput = screen.getByRole('textbox', { name: /end time/i });
		const newTime = addHours(untilDate, 5);
		newTime.setMinutes(15);
		await user.click(utilTimeInput);
		await user.click(screen.getByText(format(newTime, 'p')));
		expect(
			screen.queryByRole('listitem'),
			'the time picker dropdown should close after choosing the until time'
		).not.toBeInTheDocument();
		expect(utilTimeInput, 'the end time should show the chosen time').toHaveDisplayValue(
			format(newTime, 'p')
		);
	});

	test('should let the user type an until time', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<>
				<span>Click to blur</span>
				<OutOfOfficeTimePeriodSection
					addMod={addMod}
					removeMod={removeMod}
					disabled={false}
					prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
					prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
				/>
			</>
		);
		const untilTimeInput = screen.getByRole('textbox', { name: /end time/i });
		const newTime = new Date(untilDate);
		newTime.setHours(12);
		newTime.setMinutes(15);
		await user.clear(untilTimeInput);
		await user.type(untilTimeInput, format(newTime, 'p'), { skipClick: true });
		await user.click(screen.getByText(/click to blur/i));
		await act(async () => {
			// to let floating finish the update
			await vi.advanceTimersToNextTimerAsync();
		});
		expect(
			screen.queryByRole('listitem'),
			'the time picker dropdown should not be open after typing the until time'
		).not.toBeInTheDocument();
		expect(untilTimeInput, 'the end time should show the typed time').toHaveDisplayValue(
			format(newTime, 'p')
		);
	});

	test('should update until date and time to be equal to from date if user set a from date greater than the current until date', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<>
				<span>Click to blur</span>
				<OutOfOfficeTimePeriodSection
					addMod={addMod}
					removeMod={removeMod}
					disabled={false}
					prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
					prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
				/>
			</>
		);
		const afterUntilDate = addDays(untilDate, 2);
		const expectedDate = format(afterUntilDate, 'P');
		const expectedTime = format(fromDate, 'p');
		const fromDateInput = screen.getByRole('textbox', {
			name: /start date/i
		});
		const untilDateInput = screen.getByRole('textbox', { name: /end date/i });
		const fromTimeInput = screen.getByRole('textbox', { name: /start time/i });
		const untilTimeInput = screen.getByRole('textbox', { name: /end time/i });
		await user.clear(fromDateInput);
		await user.type(fromDateInput, expectedDate, { skipClick: true });
		await user.click(screen.getByText(/click to blur/i));
		await act(async () => {
			// to let floating finish the update
			await vi.advanceTimersToNextTimerAsync();
		});
		expect(fromDateInput, 'the start date should hold the newly typed date').toHaveDisplayValue(
			expectedDate
		);
		expect(
			untilDateInput,
			'the end date should be clamped to the from date when from is after until'
		).toHaveDisplayValue(expectedDate);
		expect(fromTimeInput, 'the start time should stay equal to the from time').toHaveDisplayValue(
			expectedTime
		);
		expect(
			untilTimeInput,
			'the end time should be clamped to the from time when from is after until'
		).toHaveDisplayValue(expectedTime);
	});

	test('should update from date and time to be equal to until date if user set an until date lower than the current from date', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<>
				<span>Click to blur</span>
				<OutOfOfficeTimePeriodSection
					addMod={addMod}
					removeMod={removeMod}
					disabled={false}
					prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
					prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
				/>
			</>
		);
		const beforeFromDate = subDays(fromDate, 2);
		const expectedDate = format(beforeFromDate, 'P');
		const expectedTime = format(untilDate, 'p');
		const fromDateInput = screen.getByRole('textbox', {
			name: /start date/i
		});
		const untilDateInput = screen.getByRole('textbox', { name: /end date/i });
		const fromTimeInput = screen.getByRole('textbox', { name: /start time/i });
		const untilTimeInput = screen.getByRole('textbox', { name: /end time/i });
		await user.clear(untilDateInput);
		await user.type(untilDateInput, expectedDate, { skipClick: true });
		await user.click(screen.getByText(/click to blur/i));
		await act(async () => {
			// to let floating finish the update
			await vi.advanceTimersToNextTimerAsync();
		});
		expect(
			fromDateInput,
			'the start date should be clamped to the until date when until is before from'
		).toHaveDisplayValue(expectedDate);
		expect(untilDateInput, 'the end date should hold the newly typed date').toHaveDisplayValue(
			expectedDate
		);
		expect(
			fromTimeInput,
			'the start time should be clamped to the until time when until is before from'
		).toHaveDisplayValue(expectedTime);
		expect(untilTimeInput, 'the end time should stay equal to the until time').toHaveDisplayValue(
			expectedTime
		);
	});

	test('should disable and update from and until time to be the start and end of the day if user checks the all day flag', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		fromDate.setHours(9, 9, 9, 9);
		const untilDate = faker.date.soon();
		untilDate.setHours(18, 18, 18, 18);
		const { user } = setup(
			<OutOfOfficeTimePeriodSection
				addMod={addMod}
				removeMod={removeMod}
				disabled={false}
				prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
				prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
			/>
		);

		const fromTimeInput = screen.getByRole('textbox', { name: /start time/i });
		const untilTimeInput = screen.getByRole('textbox', { name: /end time/i });
		await act(async () => {
			await user.click(screen.getByText(/all day/i));
		});
		await screen.findByTestId(ICONS.checkboxChecked);
		expect(
			fromTimeInput,
			'the start time should be disabled when All Day is checked'
		).toBeDisabled();
		expect(
			untilTimeInput,
			'the end time should be disabled when All Day is checked'
		).toBeDisabled();
		expect(
			fromTimeInput,
			'the start time should be set to the start of the day when All Day is checked'
		).toHaveDisplayValue(format(startOfDay(fromDate), 'p'));
		expect(
			untilTimeInput,
			'the end time should be set to the end of the day when All Day is checked'
		).toHaveDisplayValue(format(endOfDay(untilDate), 'p'));
	});

	test('should enable from and until time inputs if user unchecks the all day flag', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		fromDate.setHours(0, 0, 0, 0);
		const untilDate = faker.date.soon();
		untilDate.setHours(23, 59, 59, 0);
		const { user } = setup(
			<OutOfOfficeTimePeriodSection
				addMod={addMod}
				removeMod={removeMod}
				disabled={false}
				prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
				prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
			/>
		);

		const fromTimeInput = screen.getByRole('textbox', { name: /start time/i });
		const untilTimeInput = screen.getByRole('textbox', { name: /end time/i });
		expect(
			fromTimeInput,
			'the start time should start disabled because All Day is initially checked'
		).toBeDisabled();
		expect(
			untilTimeInput,
			'the end time should start disabled because All Day is initially checked'
		).toBeDisabled();
		await act(async () => {
			await user.click(screen.getByText(/all day/i));
		});
		await screen.findByTestId(ICONS.checkboxUnchecked);
		expect(
			fromTimeInput,
			'the start time should become enabled after unchecking All Day'
		).toBeEnabled();
		expect(
			untilTimeInput,
			'the end time should become enabled after unchecking All Day'
		).toBeEnabled();
	});

	test.each<[string, Date]>([
		['start date', faker.date.past()],
		['start time', new Date()],
		['end date', faker.date.future()],
		['end time', new Date()]
	])(
		'should not update other date and time inputs if %s change',
		async (inputName, newDateTime) => {
			const addMod = vi.fn();
			const removeMod = vi.fn();
			const fromDate = faker.date.recent();
			const untilDate = faker.date.soon();
			const { user } = setup(
				<>
					<span>Click to blur</span>
					<OutOfOfficeTimePeriodSection
						addMod={addMod}
						removeMod={removeMod}
						disabled={false}
						prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
						prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
					/>
				</>
			);

			const inputToChange = screen.getByRole('textbox', { name: RegExp(inputName, 'i') });
			const otherInputs: [HTMLInputElement, string][] = screen
				.getAllByRole<HTMLInputElement>('textbox')
				.filter((textbox) => textbox !== inputToChange)
				.map((textbox) => [textbox, textbox.value]);
			await user.clear(inputToChange);
			await user.type(inputToChange, format(newDateTime, 'Pp'), { skipClick: true });
			await user.click(screen.getByText(/click to blur/i));
			await act(async () => {
				// to let floating finish the update
				await vi.advanceTimersToNextTimerAsync();
			});
			otherInputs.forEach(([textbox, previousValue]) => {
				expect(
					textbox,
					`changing the ${inputName} input should not alter the other inputs`
				).toHaveDisplayValue(previousValue);
			});
		}
	);

	test('should update zimbraPrefOutOfOfficeFromDate when changing the from date', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<>
				<span>Click to blur</span>
				<OutOfOfficeTimePeriodSection
					addMod={addMod}
					removeMod={removeMod}
					disabled={false}
					prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
					prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
				/>
			</>
		);

		const newDateTime = faker.date.past();
		const inputToChange = screen.getByRole('textbox', { name: /start date/i });
		await user.clear(inputToChange);
		await user.type(inputToChange, format(newDateTime, 'P'), { skipClick: true });
		await user.click(screen.getByText(/click to blur/i));
		await act(async () => {
			// to let floating finish the update
			await vi.advanceTimersToNextTimerAsync();
		});
		const expectedDateTime = new Date(newDateTime);
		expectedDateTime.setHours(
			fromDate.getHours(),
			fromDate.getMinutes(),
			fromDate.getSeconds(),
			fromDate.getMilliseconds()
		);
		expect(
			addMod,
			'changing the from date should update zimbraPrefOutOfOfficeFromDate keeping the original time'
		).toHaveBeenCalledWith(
			'prefs',
			'zimbraPrefOutOfOfficeFromDate',
			dateToGenTime(expectedDateTime)
		);
	});

	test('should update zimbraPrefOutOfOfficeFromDate when changing the from time', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<>
				<span>Click to blur</span>
				<OutOfOfficeTimePeriodSection
					addMod={addMod}
					removeMod={removeMod}
					disabled={false}
					prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
					prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
				/>
			</>
		);

		const newDateTime = new Date();
		const inputToChange = screen.getByRole('textbox', { name: /start time/i });
		await user.clear(inputToChange);
		await user.type(inputToChange, format(newDateTime, 'p'), { skipClick: true });
		await user.click(screen.getByText(/click to blur/i));
		await act(async () => {
			// to let floating finish the update
			await vi.advanceTimersToNextTimerAsync();
		});
		const expectedDateTime = new Date(fromDate);
		expectedDateTime.setHours(newDateTime.getHours(), newDateTime.getMinutes(), 0, 0);
		expect(
			addMod,
			'changing the from time should update zimbraPrefOutOfOfficeFromDate keeping the original date'
		).toHaveBeenCalledWith(
			'prefs',
			'zimbraPrefOutOfOfficeFromDate',
			dateToGenTime(expectedDateTime)
		);
	});

	test('should update zimbraPrefOutOfOfficeFromDate when changing both the from date and time', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<>
				<span>Click to blur</span>
				<OutOfOfficeTimePeriodSection
					addMod={addMod}
					removeMod={removeMod}
					disabled={false}
					prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
					prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
				/>
			</>
		);

		const newDateTime = faker.date.past();
		const fromDateInput = screen.getByRole('textbox', { name: /start date/i });
		const fromTimeInput = screen.getByRole('textbox', { name: /start time/i });
		await user.clear(fromDateInput);
		await user.type(fromDateInput, format(newDateTime, 'P'), { skipClick: true });
		await user.click(fromTimeInput);
		await user.clear(fromTimeInput);
		await user.type(fromTimeInput, format(newDateTime, 'p'), { skipClick: true });
		await user.click(screen.getByText(/click to blur/i));
		await act(async () => {
			// to let floating finish the update
			await vi.advanceTimersToNextTimerAsync();
		});
		const expectedDateTime = new Date(newDateTime);
		expectedDateTime.setSeconds(0, 0);
		expect(
			addMod,
			'changing both the from date and time should update zimbraPrefOutOfOfficeFromDate with both values'
		).toHaveBeenLastCalledWith(
			'prefs',
			'zimbraPrefOutOfOfficeFromDate',
			dateToGenTime(expectedDateTime)
		);
	});

	test('should update zimbraPrefOutOfOfficeUntilDate when changing the until date', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<>
				<span>Click to blur</span>
				<OutOfOfficeTimePeriodSection
					addMod={addMod}
					removeMod={removeMod}
					disabled={false}
					prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
					prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
				/>
			</>
		);

		const newDateTime = faker.date.future();
		const inputToChange = screen.getByRole('textbox', { name: /end date/i });
		await user.clear(inputToChange);
		await user.type(inputToChange, format(newDateTime, 'P'), { skipClick: true });
		await user.click(screen.getByText(/click to blur/i));
		await act(async () => {
			// to let floating finish the update
			await vi.advanceTimersToNextTimerAsync();
		});
		const expectedDateTime = new Date(newDateTime);
		expectedDateTime.setHours(
			untilDate.getHours(),
			untilDate.getMinutes(),
			untilDate.getSeconds(),
			untilDate.getMilliseconds()
		);
		expect(
			addMod,
			'changing the until date should update zimbraPrefOutOfOfficeUntilDate keeping the original time'
		).toHaveBeenCalledWith(
			'prefs',
			'zimbraPrefOutOfOfficeUntilDate',
			dateToGenTime(expectedDateTime)
		);
	});

	test('should update zimbraPrefOutOfOfficeUntilDate when changing the until time', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<>
				<span>Click to blur</span>
				<OutOfOfficeTimePeriodSection
					addMod={addMod}
					removeMod={removeMod}
					disabled={false}
					prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
					prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
				/>
			</>
		);

		const newDateTime = new Date();
		const inputToChange = screen.getByRole('textbox', { name: /end time/i });
		await user.clear(inputToChange);
		await user.type(inputToChange, format(newDateTime, 'p'), { skipClick: true });
		await user.click(screen.getByText(/click to blur/i));
		await act(async () => {
			// to let floating finish the update
			await vi.advanceTimersToNextTimerAsync();
		});
		const expectedDateTime = new Date(untilDate);
		expectedDateTime.setHours(newDateTime.getHours(), newDateTime.getMinutes(), 0, 0);
		expect(
			addMod,
			'changing the until time should update zimbraPrefOutOfOfficeUntilDate keeping the original date'
		).toHaveBeenCalledWith(
			'prefs',
			'zimbraPrefOutOfOfficeUntilDate',
			dateToGenTime(expectedDateTime)
		);
	});

	test('should update zimbraPrefOutOfOfficeUntilDate when changing both the until date and time', async () => {
		const addMod = vi.fn();
		const removeMod = vi.fn();
		const fromDate = faker.date.recent();
		const untilDate = faker.date.soon();
		const { user } = setup(
			<>
				<span>Click to blur</span>
				<OutOfOfficeTimePeriodSection
					removeMod={removeMod}
					addMod={addMod}
					disabled={false}
					prefOutOfOfficeFromDate={dateToGenTime(fromDate)}
					prefOutOfOfficeUntilDate={dateToGenTime(untilDate)}
				/>
			</>
		);

		const newDateTime = faker.date.future();
		const untilDateInput = screen.getByRole('textbox', { name: /end date/i });
		const untilTimeInput = screen.getByRole('textbox', { name: /end time/i });
		await user.clear(untilDateInput);
		await user.type(untilDateInput, format(newDateTime, 'P'), { skipClick: true });
		await user.click(untilTimeInput);
		await user.clear(untilTimeInput);
		await user.type(untilTimeInput, format(newDateTime, 'p'), { skipClick: true });
		await user.click(screen.getByText(/click to blur/i));
		await act(async () => {
			// to let floating finish the update
			await vi.advanceTimersToNextTimerAsync();
		});
		const expectedDateTime = new Date(newDateTime);
		expectedDateTime.setSeconds(0, 0);
		expect(
			addMod,
			'changing both the until date and time should update zimbraPrefOutOfOfficeUntilDate with both values'
		).toHaveBeenLastCalledWith(
			'prefs',
			'zimbraPrefOutOfOfficeUntilDate',
			dateToGenTime(expectedDateTime)
		);
	});
});
