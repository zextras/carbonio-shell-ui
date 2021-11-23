/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useState, useCallback, FC, useEffect, useMemo } from 'react';
import { Container, Checkbox, Text, Icon, Padding } from '@zextras/zapp-ui';

import moment from 'moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
// eslint-disable-next-line import/no-extraneous-dependencies
import momentLocalizer from 'react-widgets-moment';
import { useTranslation } from 'react-i18next';
import { AccountSettings } from '../../../types';
import Heading from './settings-heading';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Styler from './date-picker-style';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { changeDateEvent, getDateEvent, startOfDate, endOfDate } from './utils';

momentLocalizer();

const DateTimeSelect: FC<{
	settings: AccountSettings;
	addMod: (type: 'prefs' | 'props', key: string, value: { value: any; app: string }) => void;
	sendAutoReply: boolean;
}> = ({ settings, addMod, sendAutoReply }) => {
	const { t } = useTranslation();
	const [dateDisabled, setDateDisabled] = useState<boolean>(false);
	const [sendAutoReplyTimePeriod, setSendAutoReplyTimePeriod] = useState<boolean>(
		!!(
			settings.prefs.zimbraPrefOutOfOfficeFromDate && settings.prefs.zimbraPrefOutOfOfficeUntilDate
		)
	);

	const [dateZimbraPrefOutOfOfficeFromDate, setZimbraPrefOutOfOfficeFromDate] = useState<string>(
		settings.prefs.zimbraPrefOutOfOfficeFromDate as string
	);

	const [dateZimbraPrefOutOfOfficeUntilDate, setZimbraPrefOutOfOfficeUntilDate] = useState<string>(
		settings.prefs.zimbraPrefOutOfOfficeUntilDate as string
	);
	const [allDay, setAllDay] = useState<boolean>(false);
	const [allDayDisabled, setAllDayDisabled] = useState<boolean>(false);
	const [timeDisabled, setTimeDisabled] = useState<boolean>(false);
	const updatePrefs = useCallback(
		(v, p) => {
			addMod('prefs', p, v);
		},
		[addMod]
	);

	useEffect(() => {
		if (sendAutoReply) {
			if (sendAutoReplyTimePeriod) {
				setTimeDisabled(false);
				setAllDayDisabled(false);
				setDateDisabled(false);
			} else {
				setAllDayDisabled(true);
				setTimeDisabled(true);
				setDateDisabled(true);
			}
			if (allDay) {
				setZimbraPrefOutOfOfficeFromDate(startOfDate(dateZimbraPrefOutOfOfficeFromDate));
				updatePrefs(
					startOfDate(dateZimbraPrefOutOfOfficeFromDate),
					'zimbraPrefOutOfOfficeFromDate'
				);
				setZimbraPrefOutOfOfficeUntilDate(endOfDate(dateZimbraPrefOutOfOfficeUntilDate));
				updatePrefs(
					endOfDate(dateZimbraPrefOutOfOfficeUntilDate),
					'zimbraPrefOutOfOfficeUntilDate'
				);

				setTimeDisabled(true);
			}
		} else {
			setDateDisabled(true);
			setTimeDisabled(true);
			setAllDay(false);
			setAllDayDisabled(true);
		}
	}, [
		settings.prefs.zimbraPrefOutOfOfficeFromDate,
		updatePrefs,
		dateZimbraPrefOutOfOfficeFromDate,
		dateZimbraPrefOutOfOfficeUntilDate,
		allDay,
		sendAutoReply,
		sendAutoReplyTimePeriod
	]);
	const toggleSendAutoReplyTimePeriod = (): void => {
		setSendAutoReplyTimePeriod(!sendAutoReplyTimePeriod);
	};

	return (
		<>
			<Heading title={t('settings.out_of_office.headings.time_period', 'Time Period')} />
			<Checkbox
				label={t(
					'settings.out_of_office.labels.send_auto_reply_period',
					'Send auto-replies during the following period:'
				)}
				value={sendAutoReplyTimePeriod}
				onClick={toggleSendAutoReplyTimePeriod}
				disabled={!sendAutoReply}
			/>
			<Styler orientation="horizontal" allDay height="fit" mainAlignment="space-between">
				<Container
					crossAlignment="flex-start"
					style={{ maxWidth: '50%' }}
					padding={{ all: 'small' }}
				>
					<Padding bottom="extrasmall">
						<Text size="small">{t('settings.out_of_office.labels.start_date', 'Start Date')}</Text>
					</Padding>
					<DateTimePicker
						disabled={dateDisabled}
						value={
							dateZimbraPrefOutOfOfficeFromDate
								? getDateEvent(dateZimbraPrefOutOfOfficeFromDate)
								: new Date()
						}
						time={false}
						onChange={(value: any): void => {
							setZimbraPrefOutOfOfficeFromDate(changeDateEvent(value));
							updatePrefs(changeDateEvent(value), 'zimbraPrefOutOfOfficeFromDate');
							if (
								moment(value).diff(getDateEvent(dateZimbraPrefOutOfOfficeUntilDate), 'minutes') >= 0
							) {
								setZimbraPrefOutOfOfficeUntilDate(
									changeDateEvent(new Date(moment(value).add(1, 'd').valueOf()))
								);
								updatePrefs(
									changeDateEvent(new Date(moment(value).add(1, 'd').valueOf())),
									'zimbraPrefOutOfOfficeUntilDate'
								);
							}
						}}
						dateIcon={
							<Padding all="small">
								<Icon icon="CalendarOutline" />
							</Padding>
						}
						timeIcon={
							<Padding all="small">
								<Icon icon="ClockOutline" />
							</Padding>
						}
					/>
				</Container>
				<Container
					crossAlignment="flex-start"
					style={{ maxWidth: '50%' }}
					padding={{ all: 'small' }}
				>
					<Padding bottom="extrasmall">
						<Text size="small">{t('settings.out_of_office.labels.end_date', 'End Date')}</Text>
					</Padding>
					<DateTimePicker
						disabled={dateDisabled}
						inputProps={{ readOnly: true }}
						value={
							dateZimbraPrefOutOfOfficeUntilDate
								? getDateEvent(dateZimbraPrefOutOfOfficeUntilDate)
								: new Date()
						}
						time={false}
						onChange={(value: any): void => {
							setZimbraPrefOutOfOfficeUntilDate(changeDateEvent(value));
							updatePrefs(changeDateEvent(value), 'zimbraPrefOutOfOfficeUntilDate');
							if (
								moment(value).diff(getDateEvent(dateZimbraPrefOutOfOfficeFromDate), 'minutes') <= 0
							) {
								setZimbraPrefOutOfOfficeFromDate(
									changeDateEvent(new Date(moment(value).subtract(1, 'd').valueOf()))
								);
								updatePrefs(
									changeDateEvent(new Date(moment(value).subtract(1, 'd').valueOf())),
									'zimbraPrefOutOfOfficeFromDate'
								);
							}
						}}
						dateIcon={
							<Padding all="small">
								<Icon icon="CalendarOutline" />
							</Padding>
						}
						timeIcon={
							<Padding all="small">
								<Icon icon="ClockOutline" />
							</Padding>
						}
					/>
				</Container>
			</Styler>

			<Container crossAlignment="flex-start">
				<Checkbox
					disabled={allDayDisabled}
					label={t('settings.out_of_office.labels.all_day', 'All Day:')}
					value={allDay}
					onClick={(): void => {
						setAllDay(!allDay);
					}}
				/>
			</Container>
			<Styler orientation="horizontal" allDay height="fit" mainAlignment="space-between">
				<Container
					crossAlignment="flex-start"
					style={{ maxWidth: '50%' }}
					padding={{ all: 'small' }}
				>
					<Padding bottom="extrasmall">
						<Text size="small">{t('settings.out_of_office.labels.start_time', 'Start Time:')}</Text>
					</Padding>
					<DateTimePicker
						disabled={timeDisabled}
						date={false}
						value={
							dateZimbraPrefOutOfOfficeFromDate
								? getDateEvent(dateZimbraPrefOutOfOfficeFromDate)
								: new Date()
						}
						time
						onChange={(value: any): void => {
							setZimbraPrefOutOfOfficeFromDate(changeDateEvent(value));
							updatePrefs(changeDateEvent(value), 'zimbraPrefOutOfOfficeFromDate');
							if (
								moment(value).diff(getDateEvent(dateZimbraPrefOutOfOfficeUntilDate), 'minutes') >= 0
							) {
								setZimbraPrefOutOfOfficeUntilDate(
									changeDateEvent(new Date(moment(value).add(1, 'd').valueOf()))
								);
								updatePrefs(
									changeDateEvent(new Date(moment(value).add(1, 'd').valueOf())),
									'zimbraPrefOutOfOfficeUntilDate'
								);
							}
						}}
						dateIcon={
							<Padding all="small">
								<Icon icon="CalendarOutline" />
							</Padding>
						}
						timeIcon={
							<Padding all="small">
								<Icon icon="ClockOutline" />
							</Padding>
						}
					/>
				</Container>
				<Container
					crossAlignment="flex-start"
					style={{ maxWidth: '50%' }}
					padding={{ all: 'small' }}
				>
					<Padding bottom="extrasmall">
						<Text size="small">{t('settings.out_of_office.labels.end_time', 'End Time:')}</Text>
					</Padding>
					<DateTimePicker
						disabled={timeDisabled}
						date={false}
						value={
							dateZimbraPrefOutOfOfficeUntilDate
								? getDateEvent(dateZimbraPrefOutOfOfficeUntilDate)
								: new Date()
						}
						time
						onChange={(value: any): void => {
							setZimbraPrefOutOfOfficeUntilDate(changeDateEvent(value));
							updatePrefs(changeDateEvent(value), 'zimbraPrefOutOfOfficeUntilDate');
							if (
								moment(value).diff(getDateEvent(dateZimbraPrefOutOfOfficeFromDate), 'minutes') <= 0
							) {
								setZimbraPrefOutOfOfficeFromDate(
									changeDateEvent(new Date(moment(value).subtract(1, 'd').valueOf()))
								);
								updatePrefs(
									changeDateEvent(new Date(moment(value).subtract(1, 'd').valueOf())),
									'zimbraPrefOutOfOfficeFromDate'
								);
							}
						}}
						timeIcon={
							<Padding all="small">
								<Icon icon="ClockOutline" />
							</Padding>
						}
					/>
				</Container>
			</Styler>
		</>
	);
};

export default DateTimeSelect;
