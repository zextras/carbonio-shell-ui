/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { DateTimePickerProps } from '@zextras/carbonio-design-system';
import { Container, Checkbox, DateTimePicker } from '@zextras/carbonio-design-system';
import type { GeneralizedTime } from '@zextras/carbonio-ui-soap-lib';

import { getT } from '../../../store/i18n/hooks';
import type { AddMod, RemoveMod } from '../../../types/network';
import { useReset } from '../../hooks/use-reset';
import type { SettingsSectionProps } from '../utils';
import {
	dateToGenTime,
	endOfDay,
	genTimeToDate,
	startOfDay,
	upsertPrefOnUnsavedChanges
} from '../utils';

interface OutOfOfficeTimePeriodSectionProps extends SettingsSectionProps {
	addMod: AddMod;
	removeMod: RemoveMod;
	disabled: boolean;
	prefOutOfOfficeFromDate: GeneralizedTime | undefined;
	prefOutOfOfficeUntilDate: GeneralizedTime | undefined;
}

function coerceGenTime(genTime: GeneralizedTime | undefined): Date {
	return genTime ? genTimeToDate(genTime) : new Date(new Date().setSeconds(0, 0));
}

export const OutOfOfficeTimePeriodSection = ({
	addMod,
	removeMod,
	disabled,
	prefOutOfOfficeFromDate,
	prefOutOfOfficeUntilDate,
	resetRef
}: OutOfOfficeTimePeriodSectionProps): React.JSX.Element => {
	const t = getT();
	const [fromDate, setFromDate] = useState<Date>(coerceGenTime(prefOutOfOfficeFromDate));
	const [untilDate, setUntilDate] = useState<Date>(coerceGenTime(prefOutOfOfficeUntilDate));
	const fromDateRef = useRef(fromDate);
	const untilDateRef = useRef(untilDate);
	const [allDayEnabled, setAllDayEnabled] = useState<boolean>(false);
	const editTimeIsDisabled = useMemo(() => disabled || allDayEnabled, [disabled, allDayEnabled]);

	const updatePref = useMemo(() => upsertPrefOnUnsavedChanges(addMod), [addMod]);

	const initPrefs = useCallback(() => {
		const fromDatePref = coerceGenTime(prefOutOfOfficeFromDate);
		const untilDatePref = coerceGenTime(prefOutOfOfficeUntilDate);
		setFromDate(fromDatePref);
		fromDateRef.current = fromDatePref;
		setUntilDate(untilDatePref);
		untilDateRef.current = untilDatePref;
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

	useEffect(() => {
		if (coerceGenTime(prefOutOfOfficeFromDate).getTime() !== fromDate.getTime()) {
			updatePref('zimbraPrefOutOfOfficeFromDate', dateToGenTime(fromDate));
		} else {
			removeMod('prefs', 'zimbraPrefOutOfOfficeFromDate');
		}
	}, [fromDate, prefOutOfOfficeFromDate, removeMod, updatePref]);

	useEffect(() => {
		if (coerceGenTime(prefOutOfOfficeUntilDate).getTime() !== untilDate.getTime()) {
			updatePref('zimbraPrefOutOfOfficeUntilDate', dateToGenTime(untilDate));
		} else {
			removeMod('prefs', 'zimbraPrefOutOfOfficeUntilDate');
		}
	}, [prefOutOfOfficeUntilDate, removeMod, untilDate, updatePref]);

	const outOfOfficeFromDateOnChange = useCallback<NonNullable<DateTimePickerProps['onChange']>>(
		(newFromDate) => {
			if (newFromDate) {
				setFromDate((prevState) => {
					if (newFromDate.getTime() !== prevState.getTime()) {
						fromDateRef.current = newFromDate;
						return newFromDate;
					}
					return prevState;
				});
			} else {
				// force an update by cloning the date, so that the input is not left empty
				setFromDate((prevState) => {
					const prevStateClone = new Date(prevState);
					fromDateRef.current = prevStateClone;
					return prevStateClone;
				});
			}
		},
		[]
	);

	const outOfOfficeUntilDateOnChange = useCallback<NonNullable<DateTimePickerProps['onChange']>>(
		(newUntilDate) => {
			if (newUntilDate) {
				setUntilDate((prevState) => {
					if (newUntilDate.getTime() !== prevState.getTime()) {
						untilDateRef.current = newUntilDate;
						return newUntilDate;
					}
					return prevState;
				});
			} else {
				// force an update by cloning the date, so that the input is not left empty
				setUntilDate((prevState) => {
					const prevStateClone = new Date(prevState);
					untilDateRef.current = prevStateClone;
					return prevStateClone;
				});
			}
		},
		[]
	);

	useEffect(() => {
		if (fromDate.getTime() > untilDateRef.current.getTime()) {
			const updatedUntil = new Date(fromDate);
			untilDateRef.current = updatedUntil;
			setUntilDate(updatedUntil);
		}
	}, [fromDate]);

	useEffect(() => {
		if (untilDate.getTime() < fromDateRef.current.getTime()) {
			const updatedFrom = new Date(untilDate);
			fromDateRef.current = updatedFrom;
			setFromDate(updatedFrom);
		}
	}, [untilDate]);

	const toggleAllDay = useCallback(() => {
		setAllDayEnabled((prevWasEnabled) => {
			const nowIsEnabled = !prevWasEnabled;
			if (nowIsEnabled) {
				setFromDate((prevState) => {
					const updatedFrom = startOfDay(prevState);
					fromDateRef.current = updatedFrom;
					return updatedFrom;
				});
				setUntilDate((prevState) => {
					const updatedUntil = endOfDay(prevState);
					untilDateRef.current = updatedUntil;
					return updatedUntil;
				});
			}
			return nowIsEnabled;
		});
	}, []);

	return (
		<Container
			padding={{ vertical: 'small' }}
			gap={'0.5rem'}
			crossAlignment={'flex-start'}
			height={'fit'}
		>
			<Container orientation={'horizontal'} gap={'0.5rem'}>
				<DateTimePicker
					label={t('settings.out_of_office.labels.start_date', 'Start Date')}
					dateFormat={'P'}
					disabled={disabled}
					defaultValue={fromDate}
					onChange={disabled ? undefined : outOfOfficeFromDateOnChange}
					showTimeSelect={false}
					width={'fill'}
				/>
				<DateTimePicker
					label={t('settings.out_of_office.labels.end_date', 'End Date')}
					dateFormat={'P'}
					disabled={disabled}
					defaultValue={untilDate}
					onChange={disabled ? undefined : outOfOfficeUntilDateOnChange}
					showTimeSelect={false}
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
					showTimeCaption={false}
					dateFormat="p"
					defaultValue={fromDate}
					onChange={disabled ? undefined : outOfOfficeFromDateOnChange}
					disabled={editTimeIsDisabled}
					width={'fill'}
				/>
				<DateTimePicker
					label={t('settings.out_of_office.labels.end_time', 'End Time')}
					showTimeSelect
					showTimeSelectOnly
					showTimeCaption={false}
					dateFormat="p"
					defaultValue={untilDate}
					onChange={disabled ? undefined : outOfOfficeUntilDateOnChange}
					disabled={editTimeIsDisabled}
					width={'fill'}
				/>
			</Container>
		</Container>
	);
};
