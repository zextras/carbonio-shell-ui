/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import {
	Checkbox,
	Container,
	Dropdown,
	DropdownItem,
	Icon,
	Input,
	InputProps,
	Padding,
	Row,
	Select,
	SelectItem,
	SingleSelectionOnChange,
	Text
} from '@zextras/carbonio-design-system';
import { filter, find } from 'lodash';
import { useTranslation } from 'react-i18next';

import { IdentityAttrs } from '../../../../types';
import { EMAIL_VALIDATION_REGEX } from '../../../constants';

type SettingsSentMessagesProps = {
	identityAttrs: IdentityAttrs;
	updateIdentities: <K extends keyof IdentityAttrs>(
		id: string,
		key: K,
		value: IdentityAttrs[K]
	) => void;
	availableEmailAddresses?: string[];
};

const blankItem: SelectItem = { label: '', value: '' };

const SettingsSentMessages = ({
	identityAttrs,
	updateIdentities,
	availableEmailAddresses
}: SettingsSentMessagesProps): ReactElement => {
	const [t] = useTranslation();
	const title = useMemo(() => t('label.settings_sent_messages', 'Settings for Sent Messages'), [t]);
	const [replyToEnabledValue, setReplyToEnabledValue] = useState(
		identityAttrs.zimbraPrefReplyToEnabled === 'TRUE'
	);
	const [replyToAddress, setReplyToAddress] = useState<string>(
		identityAttrs.zimbraPrefReplyToAddress || ''
	);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [fromDisplayValue, setFromDisplayValue] = useState<string>(
		identityAttrs.zimbraPrefFromDisplay || ''
	);
	const [replyToDisplay, setReplyToDisplay] = useState<string>(
		identityAttrs.zimbraPrefReplyToDisplay || ''
	);
	const fromAddressArray = useMemo(
		(): SelectItem[] =>
			availableEmailAddresses
				? availableEmailAddresses.map((address): SelectItem => ({ value: address, label: address }))
				: [blankItem],
		[availableEmailAddresses]
	);
	const [fromAddress, setFromAddress] = useState(
		() =>
			find(fromAddressArray, (item) => item.value === identityAttrs.zimbraPrefFromAddress) ??
			blankItem
	);

	useEffect(() => {
		setReplyToEnabledValue(identityAttrs.zimbraPrefReplyToEnabled === 'TRUE');
	}, [identityAttrs.zimbraPrefReplyToEnabled]);
	useEffect(() => {
		setFromDisplayValue(identityAttrs.zimbraPrefFromDisplay || '');
	}, [identityAttrs.zimbraPrefFromDisplay]);
	useEffect(() => {
		setFromAddress(
			find(fromAddressArray, (item) => item.value === identityAttrs.zimbraPrefFromAddress) ??
				blankItem
		);
	}, [fromAddressArray, identityAttrs.zimbraPrefFromAddress]);
	useEffect(() => {
		setReplyToDisplay(
			identityAttrs.zimbraPrefReplyToDisplay === undefined
				? ''
				: identityAttrs.zimbraPrefReplyToDisplay
		);
	}, [identityAttrs.zimbraPrefReplyToDisplay]);
	useEffect(() => {
		setReplyToAddress(identityAttrs.zimbraPrefReplyToAddress || '');
	}, [identityAttrs.zimbraPrefReplyToAddress]);

	const onClickReplyToEnabled = useCallback(() => {
		setReplyToEnabledValue((prevState) => {
			const newState = !prevState;
			if (identityAttrs.zimbraPrefIdentityId) {
				updateIdentities(
					identityAttrs.zimbraPrefIdentityId,
					'zimbraPrefReplyToEnabled',
					prevState ? 'FALSE' : 'TRUE'
				);
			}
			return newState;
		});
	}, [identityAttrs.zimbraPrefIdentityId, updateIdentities]);

	const fromDisplayLabel = useMemo(() => t('label.from_name', 'From: "Name"'), [t]);
	const onChangeFromDisplayValue: InputProps['onChange'] = (e) => {
		setFromDisplayValue(e.target.value);
		if (identityAttrs.zimbraPrefIdentityId) {
			updateIdentities(identityAttrs.zimbraPrefIdentityId, 'zimbraPrefFromDisplay', e.target.value);
		}
	};

	const fromAddressLabel = useMemo(() => t('label.address', 'Address'), [t]);

	const onChangeFromAddress = useCallback<SingleSelectionOnChange>(
		(newAddress) => {
			if (!newAddress) {
				return;
			}

			if (fromAddress?.value === newAddress) {
				return;
			}
			setFromAddress(filter(fromAddressArray, (item) => item.value === newAddress)[0]);
			if (identityAttrs.zimbraPrefIdentityId) {
				updateIdentities(identityAttrs.zimbraPrefIdentityId, 'zimbraPrefFromAddress', newAddress);
			}
		},
		[fromAddress?.value, fromAddressArray, identityAttrs.zimbraPrefIdentityId, updateIdentities]
	);

	const replyToEnabledLabel = t(
		'label.set_reply_to_field',
		'Set the "Reply-to" field of e-mail message to:'
	);

	const replyToDisplayLabel = useMemo(
		() => t('label.reply_to_field_example', 'e.g. Bob Smith'),
		[t]
	);
	const onChangePrefReplyToDisplay = useCallback<NonNullable<InputProps['onChange']>>(
		(e) => {
			setReplyToDisplay(e.target.value);
			if (identityAttrs.zimbraPrefIdentityId) {
				updateIdentities(
					identityAttrs.zimbraPrefIdentityId,
					'zimbraPrefReplyToDisplay',
					e.target.value
				);
			}
		},
		[identityAttrs.zimbraPrefIdentityId, updateIdentities]
	);

	const replyToAddressLabel = useMemo(() => t('label.choose_account', 'Choose an account'), [t]);

	const onChangeReplyToAddress = useCallback(
		(value: string) => {
			setReplyToAddress(value);
			if (identityAttrs.zimbraPrefIdentityId) {
				updateIdentities(identityAttrs.zimbraPrefIdentityId, 'zimbraPrefReplyToAddress', value);
			}
		},
		[updateIdentities, identityAttrs.zimbraPrefIdentityId]
	);

	const replyToAddressArray = useMemo(
		(): DropdownItem[] => [
			{
				id: '0',
				label: identityAttrs.zimbraPrefFromAddress ?? '',
				onClick: () => onChangeReplyToAddress(identityAttrs.zimbraPrefFromAddress ?? '')
			}
		],
		[identityAttrs.zimbraPrefFromAddress, onChangeReplyToAddress]
	);

	const isValidEmail = useMemo(
		() => replyToEnabledValue && !EMAIL_VALIDATION_REGEX.test(replyToAddress || ''),
		[replyToEnabledValue, replyToAddress]
	);

	return (
		<>
			<Container
				minWidth="calc(min(100%, 32rem))"
				width="fill"
				padding={{ all: 'large' }}
				height="fit"
				background={'gray6'}
				mainAlignment="flex-start"
			>
				<Padding horizontal="medium" width="100%">
					<Text weight="bold">{title}</Text>
				</Padding>
			</Container>
			<Row
				width="fill"
				padding={{ horizontal: 'large', bottom: 'large' }}
				height="fit"
				background={'gray6'}
				mainAlignment="flex-start"
			>
				<Row width={'50%'} padding={{ right: 'small' }}>
					{/* zimbraPrefFromDisplay */}
					<Input
						label={fromDisplayLabel}
						value={fromDisplayValue}
						onChange={onChangeFromDisplayValue}
					/>
				</Row>
				<Row width="50%">
					{/* zimbraPrefFromAddress */}
					<Select
						label={fromAddressLabel}
						selection={fromAddress}
						items={fromAddressArray}
						showCheckbox={false}
						background={'gray5'}
						onChange={onChangeFromAddress}
					/>
				</Row>
			</Row>
			<Row
				width="fill"
				background={'gray6'}
				mainAlignment="flex-start"
				padding={{ horizontal: 'large', bottom: 'large' }}
			>
				{/* zimbraPrefReplyToEnabled */}
				<Checkbox
					label={replyToEnabledLabel}
					value={replyToEnabledValue}
					onClick={onClickReplyToEnabled}
				/>
			</Row>
			<Row
				width="fill"
				padding={{ horizontal: 'large', bottom: 'large' }}
				height="fit"
				background={'gray6'}
				mainAlignment="flex-start"
			>
				<Row width="50%" padding={{ right: 'small' }}>
					{/* zimbraPrefReplyToDisplay */}
					<Input
						label={replyToDisplayLabel}
						value={replyToDisplay}
						disabled={!replyToEnabledValue}
						onChange={onChangePrefReplyToDisplay}
					/>
				</Row>
				<Row width="50%">
					{/* zimbraPrefReplyToAddress */}
					<Dropdown
						items={replyToAddressArray}
						placement="bottom-start"
						style={{ flexGrow: '1' }}
						onClose={(): void => setDropdownOpen(false)}
						onOpen={(): void => setDropdownOpen(true)}
						disabled={!replyToEnabledValue}
					>
						<Input
							label={replyToAddressLabel}
							value={replyToAddress}
							onChange={(ev): void => onChangeReplyToAddress(ev.target.value)}
							hasError={isValidEmail}
							CustomIcon={(): ReactElement => (
								<Icon icon={dropdownOpen ? 'ArrowUp' : 'ArrowDown'} />
							)}
							disabled={!replyToEnabledValue}
						/>
					</Dropdown>
				</Row>
			</Row>
			<Padding bottom="large" />
		</>
	);
};

export default SettingsSentMessages;
