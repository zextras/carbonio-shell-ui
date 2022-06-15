/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactElement, SyntheticEvent, useCallback, useState } from 'react';
import {
	Container,
	Text,
	List,
	Divider,
	Row,
	Padding,
	ButtonOld as Button,
	Radio,
	RadioGroup,
	ItemType,
	ItemComponentProps
} from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';
import { emptyFunction } from '../../../utils';

export interface DelegateType extends ItemType {
	email: string;
	right: string;
	label?: string;
}

type DelegatesProps = {
	t: TFunction;
	items: Array<DelegateType>;
	activeDelegateView: string;
	setActiveDelegateView: (value: string) => void;
};

const Delegates = ({
	t,
	items,
	activeDelegateView,
	setActiveDelegateView
}: DelegatesProps): ReactElement => {
	const [activeValue, setActiveValue] = useState('1');

	const changeView = (value: string): void => setActiveDelegateView(value);

	const ListItem = ({ item }: ItemComponentProps<DelegateType>): ReactElement => (
		<>
			<Container
				onClick={(): void => changeView(item.id)}
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

	return (
		<>
			<Container
				minWidth="calc(min(100%, 512px))"
				width="fill"
				padding={{ all: 'large' }}
				height="fit"
				background="gray6"
				mainAlignment="flex-start"
			>
				<Padding horizontal="medium" bottom="large" width="100%">
					<Text weight="bold">{t('label.delegates', 'Delegates')}</Text>
				</Padding>
				<List items={items} ItemComponent={ListItem} active={activeDelegateView} height="fit" />
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
						onClick={emptyFunction}
					/>
				</Padding>
				<Padding right="small">
					<Button
						label={t('label.edit_permissions', 'Edit permissions')}
						color="primary"
						type="outlined"
						disabled
						onClick={emptyFunction}
					/>
				</Padding>
				<Button
					label={t('label.remove', 'remove')}
					color="error"
					type="outlined"
					disabled
					onClick={emptyFunction}
				/>
			</Row>
			<Container
				minWidth="calc(min(100%, 512px))"
				width="100%"
				padding={{ all: 'large' }}
				height="fit"
				background="gray6"
				mainAlignment="flex-start"
			>
				<RadioGroup
					style={{ width: '100%', justifyContent: 'flex-start' }}
					value={activeValue}
					onChange={(newValue: string): void => setActiveValue(newValue)}
				>
					<Radio
						width="100%"
						label={t(
							'label.save_to_my_sent_folder',
							'Save a copy of sent messages to my Sent folder'
						)}
						value="1"
					/>
					<Radio
						label={t(
							'label.save_delegate_folder',
							'Save a copy of sent messages to delegate’s Sent folder'
						)}
						value="2"
					/>
					<Radio
						label={t(
							'label.save_both_folders',
							'Save a copy of sent messages to my Sent folder and delegate’s folder'
						)}
						value="3"
					/>
					<Radio label={t('label.dont_save', 'Don’t save a copy of sent messages')} value="4" />
				</RadioGroup>
				<Padding bottom="large" />
			</Container>
		</>
	);
};

export default Delegates;
