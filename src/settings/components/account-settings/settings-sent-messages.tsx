/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo, useCallback, ReactElement, useState, useEffect, ChangeEvent } from 'react';
import {
	Container,
	Text,
	Padding,
	Input,
	Row,
	Select,
	Checkbox,
	Dropdown,
	Icon,
	DropdownItem
} from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';
import { filter, find } from 'lodash';
import { IdentityProps } from '../../../../types';
import { EMAIL_VALIDATION_REGEX } from '../../../constants';

type SettingsSentMessagesProps = {
	t: TFunction;
	items: IdentityProps;
	isExternalAccount: boolean;
	updateIdentities: (modifyList: {
		id: string | number;
		key: string;
		value: string | boolean;
	}) => void;
};

const blankItem = { label: '', value: '' };

const SettingsSentMessages = ({
	t,
	items,
	isExternalAccount,
	updateIdentities
}: SettingsSentMessagesProps): ReactElement => {
	const title = useMemo(() => t('label.settings_sent_messages', 'Settings for Sent Messages'), [t]);
	const [replyToEnabledValue, setReplyToEnabledValue] = useState(items.replyToEnabled === 'TRUE');
	const [replyToAddress, setReplyToAddress] = useState(items.replyToAddress);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [fromDisplayValue, setFromDisplayValue] = useState(items.fromDisplay);
	const [replyToDisplay, setReplyToDisplay] = useState(items?.replyToDisplay);
	const fromAddressArray = useMemo(
		() => [{ value: items.fromAddress ?? '', label: items.fromAddress ?? '' }],
		[items?.fromAddress]
	);
	const [fromAddress, setFromAddress] = useState(
		() => find(fromAddressArray, (item) => item.value === items.fromAddress) ?? blankItem
	);

	useEffect(() => {
		setReplyToEnabledValue(items.replyToEnabled === 'TRUE');
	}, [items.replyToEnabled]);
	useEffect(() => {
		setFromDisplayValue(items.fromDisplay);
	}, [items.fromDisplay]);
	useEffect(() => {
		const k = find(fromAddressArray, (item) => item.value === items.fromAddress) ?? blankItem;
		setFromAddress(k);
	}, [fromAddressArray, items.fromAddress]);
	useEffect(() => {
		setReplyToDisplay(items?.replyToDisplay === undefined ? '' : items?.replyToDisplay);
	}, [items?.replyToDisplay]);
	useEffect(() => {
		setReplyToAddress(items.replyToAddress);
	}, [items.replyToAddress]);

	const onClickReplyToEnabled = useCallback(() => {
		setReplyToEnabledValue(!replyToEnabledValue);
		const modifyProp = {
			id: items.identityId,
			key: 'zimbraPrefReplyToEnabled',
			value: replyToEnabledValue ? 'FALSE' : 'TRUE'
		};
		updateIdentities(modifyProp);
	}, [items.identityId, replyToEnabledValue, updateIdentities]);

	const fromDisplayLabel = useMemo(
		() => (fromDisplayValue ? '' : t('label.from_name', 'From: "Name"')),
		[t, fromDisplayValue]
	);
	const onChangeFromDisplayValue = (value: string): void => {
		setFromDisplayValue(value);
		const modifyProp = {
			id: items.identityId,
			key: 'zimbraPrefFromDisplay',
			value
		};
		updateIdentities(modifyProp);
	};

	const fromAddressLabel = useMemo(
		() => (fromAddress ? '' : t('label.address', 'Address')),
		[fromAddress, t]
	);

	const onChangeFromAddress = useCallback(
		(newVal) => {
			setFromAddress(filter(fromAddressArray, (item) => item.value === newVal)[0]);
			const modifyProp = {
				id: items.identityId,
				key: 'zimbraPrefFromAddress',
				value: newVal
			};
			updateIdentities(modifyProp);
		},
		[items.identityId, updateIdentities, fromAddressArray]
	);

	const replyToEnabledLabel = useMemo(
		() => t('label.set_reply_to_field', 'Set the "Reply-to" field of e-mail message to:'),
		[t]
	);

	const replyToDisplayLabel = useMemo(
		() => (replyToDisplay ? '' : t('label.reply_to_field_example', 'e.g. Bob Smith')),
		[t, replyToDisplay]
	);
	const onChangePrefReplyToDisplay = useCallback(
		(value: string): void => {
			setReplyToDisplay(value);
			const modifyProp = {
				id: items.identityId,
				key: 'zimbraPrefReplyToDisplay',
				value
			};
			updateIdentities(modifyProp);
		},
		[updateIdentities, items.identityId]
	);

	const replyToAddressLabel = useMemo(
		() => (replyToAddress ? '' : t('label.choose_account', 'Choose an account')),
		[t, replyToAddress]
	);

	const replyToAddressArray = useMemo(
		() => [
			{
				id: '0',
				label: items.fromAddress ?? ''
			}
		],
		[items.fromAddress]
	);

	const onChangeReplyToAddress = useCallback(
		(value: string) => {
			setReplyToAddress(value);
			const modifyProp = {
				id: items.identityId,
				key: 'zimbraPrefReplyToAddress',
				value
			};
			updateIdentities(modifyProp);
		},
		[updateIdentities, items.identityId]
	);

	const isValidEmail = useMemo(
		() => replyToEnabledValue && !EMAIL_VALIDATION_REGEX.test(replyToAddress || ''),
		[replyToEnabledValue, replyToAddress]
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
				<Padding horizontal="medium" width="100%">
					<Text weight="bold">{title}</Text>
				</Padding>
			</Container>
			<Row
				width="fill"
				padding={{ horizontal: 'large', bottom: 'large' }}
				height="fit"
				background="gray6"
				mainAlignment="flex-start"
			>
				<Row
					width={isExternalAccount ? '100%' : '50%'}
					padding={{ right: isExternalAccount ? '' : 'small' }}
				>
					<Input
						label={fromDisplayLabel}
						value={fromDisplayValue}
						onChange={(ev): void => onChangeFromDisplayValue(ev.target.value)}
					/>
				</Row>
				{!isExternalAccount && (
					<Row width="50%">
						<Select
							label={fromAddressLabel}
							selection={fromAddress}
							items={fromAddressArray}
							showCheckbox={false}
							background="gray5"
							onChange={(): unknown => onChangeFromAddress}
						/>
					</Row>
				)}
			</Row>
			<Row
				width="fill"
				background="gray6"
				mainAlignment="flex-start"
				padding={{ horizontal: 'large', bottom: 'large' }}
			>
				<Checkbox
					label={replyToEnabledLabel}
					value={replyToEnabledValue}
					onClick={(): void => onClickReplyToEnabled()}
				/>
			</Row>
			<Row
				width="fill"
				padding={{ horizontal: 'large', bottom: 'large' }}
				height="fit"
				background="gray6"
				mainAlignment="flex-start"
			>
				<Row width="50%" padding={{ right: 'small' }}>
					<Input
						label={replyToDisplayLabel}
						value={replyToDisplay}
						disabled={!replyToEnabledValue}
						onChange={(ev): void => onChangePrefReplyToDisplay(ev.target.value)}
					/>
				</Row>
				<Row width="50%">
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
