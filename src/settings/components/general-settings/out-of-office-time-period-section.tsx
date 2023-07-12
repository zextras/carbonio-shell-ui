/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
	Checkbox,
	Container,
	DateTimePicker,
	DateTimePickerProps
} from '@zextras/carbonio-design-system';

import { AddMod, GeneralizedTime } from '../../../../types';
import { getT } from '../../../store/i18n';
import { useReset } from '../../hooks/use-reset';
import {
	dateToGenTime,
	endOfDay,
	genTimeToDate,
	SettingsSectionProps,
	startOfDay,
	upsertPrefOnUnsavedChanges
} from '../utils';

interface OutOfOfficeTimePeriodSectionProps extends SettingsSectionProps {
	addMod: AddMod;
	disabled: boolean;
	prefOutOfOfficeFromDate: GeneralizedTime | undefined;
	prefOutOfOfficeUntilDate: GeneralizedTime | undefined;
}

function coerceGenTime(genTime: GeneralizedTime | undefined): Date {
	return genTime ? genTimeToDate(genTime) : new Date();
}

export const OutOfOfficeTimePeriodSection = ({
	addMod,
	disabled,
	prefOutOfOfficeFromDate,
	prefOutOfOfficeUntilDate,
	resetRef
}: OutOfOfficeTimePeriodSectionProps): JSX.Element => {
	const t = getT();
	const [fromDate, setFromDate] = useState<Date>(coerceGenTime(prefOutOfOfficeFromDate));
	const [untilDate, setUntilDate] = useState<Date>(coerceGenTime(prefOutOfOfficeUntilDate));
	const [allDayEnabled, setAllDayEnabled] = useState<boolean>(false);
	const editTimeIsDisabled = useMemo(() => disabled || allDayEnabled, [disabled, allDayEnabled]);

	const updatePref = useMemo(() => upsertPrefOnUnsavedChanges(addMod), [addMod]);

	const initPrefs = useCallback(() => {
		const fromDatePref = coerceGenTime(prefOutOfOfficeFromDate);
		const untilDatePref = coerceGenTime(prefOutOfOfficeUntilDate);
		setFromDate(fromDatePref);
		setUntilDate(untilDatePref);
		// there is no pref for the all day check. It is considered all day if the start date time is midnight
		// and the until date time is 23:59:59:00
		const fromDateAllDay = startOfDay(fromDatePref);
		const untilDateAllDay = endOfDay(untilDatePref);
		setAllDayEnabled(
			fromDatePref.getTime() === fromDateAllDay.getTime() &&
				untilDatePref.getTime() === untilDateAllDay.getTime()
		);
	}, [prefOutOfOfficeFromDate, prefOutOfOfficeUntilDate]);

	useEffect(() => {
		initPrefs();
	}, [initPrefs]);

	useReset(resetRef, initPrefs);

	const outOfOfficeFromDateOnChange = useCallback<NonNullable<DateTimePickerProps['onChange']>>(
		(newFromDate) => {
			if (newFromDate) {
				setFromDate((prevState) => {
					if (newFromDate.getTime() !== prevState.getTime()) {
						updatePref('zimbraPrefOutOfOfficeFromDate', dateToGenTime(newFromDate));
					}
					return newFromDate;
				});
				if (newFromDate.getTime() > untilDate.getTime()) {
					const newUntilDate = new Date(newFromDate);
					setUntilDate(newUntilDate);
					updatePref('zimbraPrefOutOfOfficeUntilDate', dateToGenTime(newUntilDate));
				}
			} else {
				// force an update by cloning the date, so that the input is not left empty
				setFromDate((prevState) => new Date(prevState));
			}
		},
		[untilDate, updatePref]
	);

	const outOfOfficeUntilDateOnChange = useCallback<NonNullable<DateTimePickerProps['onChange']>>(
		(newUntilDate) => {
			if (newUntilDate) {
				setUntilDate((prevState) => {
					if (newUntilDate.getTime() !== prevState.getTime()) {
						updatePref('zimbraPrefOutOfOfficeUntilDate', dateToGenTime(newUntilDate));
					}
					return newUntilDate;
				});
				if (newUntilDate.getTime() < fromDate.getTime()) {
					const newFromDate = new Date(newUntilDate);
					setFromDate(newFromDate);
					updatePref('zimbraPrefOutOfOfficeFromDate', dateToGenTime(newFromDate));
				}
			} else {
				// force an update by cloning the date, so that the input is not left empty
				setUntilDate((prevState) => new Date(prevState));
			}
		},
		[fromDate, updatePref]
	);

	const toggleAllDay = useCallback(() => {
		setAllDayEnabled((prevWasEnabled) => {
			const nowIsEnabled = !prevWasEnabled;
			if (nowIsEnabled) {
				setFromDate((prevState) => {
					const startOfFromDate = startOfDay(prevState);
					if (startOfFromDate.getTime() !== prevState.getTime()) {
						updatePref('zimbraPrefOutOfOfficeFromDate', dateToGenTime(startOfFromDate));
					}
					return startOfFromDate;
				});
				setUntilDate((prevState) => {
					const endOfUntilDate = endOfDay(prevState);
					if (endOfUntilDate.getTime() !== prevState.getTime()) {
						updatePref('zimbraPrefOutOfOfficeUntilDate', dateToGenTime(endOfUntilDate));
					}
					return endOfUntilDate;
				});
			}
			return nowIsEnabled;
		});
	}, [updatePref]);

	return (
		<Container padding={{ vertical: 'small' }} gap={'0.5rem'} crossAlignment={'flex-start'}>
			<Container orientation={'horizontal'} gap={'0.5rem'}>
				<DateTimePicker
					label={t('settings.out_of_office.labels.start_date', 'Start Date')}
					dateFormat={'P'}
					disabled={disabled}
					defaultValue={fromDate}
					onChange={outOfOfficeFromDateOnChange}
					includeTime={false}
					width={'fill'}
				/>
				<DateTimePicker
					label={t('settings.out_of_office.labels.end_date', 'End Date')}
					dateFormat={'P'}
					disabled={disabled}
					timeLabel={''}
					defaultValue={untilDate}
					onChange={outOfOfficeUntilDateOnChange}
					includeTime={false}
					width={'fill'}
				/>
			</Container>
			<Checkbox
				disabled={disabled}
				label={t('settings.out_of_office.labels.all_day', 'All Day:')}
				value={allDayEnabled}
				onClick={toggleAllDay}
			/>
			<Container orientation={'horizontal'} gap={'0.5rem'}>
				<DateTimePicker
					label={t('settings.out_of_office.labels.start_time', 'Start Time')}
					showTimeSelect
					showTimeSelectOnly
					timeLabel=""
					dateFormat="p"
					defaultValue={fromDate}
					onChange={outOfOfficeFromDateOnChange}
					disabled={editTimeIsDisabled}
					width={'fill'}
				/>
				<DateTimePicker
					label={t('settings.out_of_office.labels.end_time', 'End Time')}
					showTimeSelect
					showTimeSelectOnly
					timeLabel=""
					dateFormat="p"
					defaultValue={untilDate}
					onChange={outOfOfficeUntilDateOnChange}
					disabled={editTimeIsDisabled}
					width={'fill'}
				/>
			</Container>
		</Container>
	);
};
