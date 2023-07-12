/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactElement, useCallback, useState } from 'react';

import {
	Container,
	Text,
	List,
	Divider,
	Row,
	Padding,
	Button,
	Radio,
	RadioGroup,
	ItemType,
	ItemComponentProps
} from '@zextras/carbonio-design-system';
import { noop } from 'lodash';
import { useTranslation } from 'react-i18next';

import { AccountSettingsPrefs } from '../../../../types';
import { DELEGATED_SEND_SAVE_TARGET } from '../../../constants';
import { useReset } from '../../hooks/use-reset';
import { SettingsSectionProps } from '../utils';

export interface DelegateType extends ItemType {
	email: string;
	right: string;
	label?: string;
}

export type DelegatesProps = {
	delegatedSendSaveTarget: AccountSettingsPrefs['zimbraPrefDelegatedSendSaveTarget'];
	updateDelegatedSendSaveTarget: (
		updatedValue: AccountSettingsPrefs['zimbraPrefDelegatedSendSaveTarget']
	) => void;
	delegates: DelegateType[];
} & SettingsSectionProps;
const Delegates = ({
	delegatedSendSaveTarget,
	updateDelegatedSendSaveTarget,
	resetRef,
	delegates
}: DelegatesProps): JSX.Element => {
	const [t] = useTranslation();

	const [activeDelegate, setActiveDelegate] = useState<string>('0');

	const [activeValue, setActiveValue] =
		useState<AccountSettingsPrefs['zimbraPrefDelegatedSendSaveTarget']>(delegatedSendSaveTarget);

	const radioGroupOnChange = useCallback<(newValue: string) => void>(
		(newValue) => {
			function isZimbraPrefDelegatedSendSaveTarget(
				arg: string
			): arg is NonNullable<AccountSettingsPrefs['zimbraPrefDelegatedSendSaveTarget']> {
				return DELEGATED_SEND_SAVE_TARGET.includes(arg);
			}
			if (isZimbraPrefDelegatedSendSaveTarget(newValue)) {
				setActiveValue(newValue);
				updateDelegatedSendSaveTarget(newValue);
			} else {
				throw new Error('invalid zimbraPrefDelegatedSendSaveTarget value');
			}
		},
		[updateDelegatedSendSaveTarget]
	);

	const resetHandler = useCallback((): void => {
		setActiveValue(delegatedSendSaveTarget);
		updateDelegatedSendSaveTarget(delegatedSendSaveTarget);
	}, [delegatedSendSaveTarget, updateDelegatedSendSaveTarget]);

	useReset(resetRef, resetHandler);

	const ListItem = ({ item }: ItemComponentProps<DelegateType>): ReactElement => {
		const setActiveDelegateCallback = useCallback(() => setActiveDelegate(item.id), [item.id]);
		return (
			<>
				<Container
					onClick={setActiveDelegateCallback}
					orientation="horizontal"
					mainAlignment="flex-start"
					padding={{ all: 'small' }}
				>
					<Row width="fill" mainAlignment="space-between">
						<Container orientation="horizontal" mainAlignment="flex-start" width="fit">
							<Padding right="small">
								<Text weight="regular" size="small">
									{item.label}
								</Text>
							</Padding>
							<Padding right="small">
								<Text weight="regular" size="small" color="secondary">
									{item.email}
								</Text>
							</Padding>
						</Container>
						<Container width="fit" mainAlignment="flex-end">
							<Text weight="regular" size="small">
								{item.right}
							</Text>
						</Container>
					</Row>

					<Row width="fit"></Row>
				</Container>
				<Divider />
			</>
		);
	};

	return (
		<>
			<Container
				minWidth="calc(min(100%, 32rem))"
				width="fill"
				padding={{ all: 'large' }}
				height="fit"
				background="gray6"
				mainAlignment="flex-start"
			>
				<Padding horizontal="medium" bottom="large" width="100%">
					<Text weight="bold">{t('label.delegates', 'Delegates')}</Text>
				</Padding>
				<List items={delegates} ItemComponent={ListItem} active={activeDelegate} height="fit" />
			</Container>
			<Row
				padding={{ horizontal: 'large' }}
				width="fill"
				mainAlignment="flex-start"
				background="gray6"
			>
				<Padding right="small">
					<Button
						label={t('label.add_delegate', 'Add delegate')}
						color="primary"
						type="outlined"
						disabled
						onClick={noop}
					/>
				</Padding>
				<Padding right="small">
					<Button
						label={t('label.edit_permissions', 'Edit permissions')}
						color="primary"
						type="outlined"
						disabled
						onClick={noop}
					/>
				</Padding>
				<Button
					label={t('label.remove', 'remove')}
					color="error"
					type="outlined"
					disabled
					onClick={noop}
				/>
			</Row>
			<Container
				minWidth="calc(min(100%, 32rem))"
				width="100%"
				padding={{ all: 'large' }}
				height="fit"
				background="gray6"
				mainAlignment="flex-start"
			>
				<RadioGroup
					style={{ width: '100%', justifyContent: 'flex-start' }}
					value={activeValue}
					onChange={radioGroupOnChange}
				>
					<Radio
						width="100%"
						label={t(
							'label.save_to_my_sent_folder',
							'Save a copy of sent messages to my Sent folder'
						)}
						value={'owner'}
					/>
					<Radio
						label={t(
							'label.save_delegate_folder',
							'Save a copy of sent messages to delegate’s Sent folder'
						)}
						value={'sender'}
					/>
					<Radio
						label={t(
							'label.save_both_folders',
							'Save a copy of sent messages to my Sent folder and delegate’s folder'
						)}
						value={'both'}
					/>
					<Radio
						label={t('label.dont_save', 'Don’t save a copy of sent messages')}
						value={'none'}
					/>
				</RadioGroup>
				<Padding bottom="large" />
			</Container>
		</>
	);
};

export default Delegates;
