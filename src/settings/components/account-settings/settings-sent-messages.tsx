/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
import { TFunction } from 'i18next';
import { filter, find } from 'lodash';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { IdentityAttrs, IdentityProps } from '../../../../types';
import { EMAIL_VALIDATION_REGEX } from '../../../constants';

type SettingsSentMessagesProps = {
	t: TFunction;
	identity: IdentityProps;
	isExternalAccount: boolean;
	updateIdentities: <K extends keyof IdentityAttrs>(
		id: string | number,
		key: K,
		value: IdentityAttrs[K]
	) => void;
	availableEmailAddresses?: string[];
};

const blankItem: SelectItem = { label: '', value: '' };

const SettingsSentMessages = ({
	t,
	identity,
	isExternalAccount,
	updateIdentities,
	availableEmailAddresses
}: SettingsSentMessagesProps): ReactElement => {
	const title = useMemo(() => t('label.settings_sent_messages', 'Settings for Sent Messages'), [t]);
	const [replyToEnabledValue, setReplyToEnabledValue] = useState(
		identity.replyToEnabled === 'TRUE'
	);
	const [replyToAddress, setReplyToAddress] = useState(identity.replyToAddress);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [fromDisplayValue, setFromDisplayValue] = useState(identity.fromDisplay);
	const [replyToDisplay, setReplyToDisplay] = useState(identity?.replyToDisplay);
	const fromAddressArray = useMemo(
		(): SelectItem[] =>
			availableEmailAddresses
				? availableEmailAddresses.map((address): SelectItem => ({ value: address, label: address }))
				: [blankItem],
		[availableEmailAddresses]
	);
	const [fromAddress, setFromAddress] = useState(
		() => find(fromAddressArray, (item) => item.value === identity.fromAddress) ?? blankItem
	);

	useEffect(() => {
		setReplyToEnabledValue(identity.replyToEnabled === 'TRUE');
	}, [identity.replyToEnabled]);
	useEffect(() => {
		setFromDisplayValue(identity.fromDisplay);
	}, [identity.fromDisplay]);
	useEffect(() => {
		const k = find(fromAddressArray, (item) => item.value === identity.fromAddress) ?? blankItem;
		setFromAddress(k);
	}, [fromAddressArray, identity.fromAddress]);
	useEffect(() => {
		setReplyToDisplay(identity?.replyToDisplay === undefined ? '' : identity?.replyToDisplay);
	}, [identity?.replyToDisplay]);
	useEffect(() => {
		setReplyToAddress(identity.replyToAddress);
	}, [identity.replyToAddress]);

	const onClickReplyToEnabled = useCallback(() => {
		setReplyToEnabledValue((prevState) => {
			const newState = !prevState;
			updateIdentities(
				identity.identityId,
				'zimbraPrefReplyToEnabled',
				prevState ? 'FALSE' : 'TRUE'
			);
			return newState;
		});
	}, [identity.identityId, updateIdentities]);

	const fromDisplayLabel = useMemo(
		() => (fromDisplayValue ? '' : t('label.from_name', 'From: "Name"')),
		[t, fromDisplayValue]
	);
	const onChangeFromDisplayValue: InputProps['onChange'] = (e) => {
		setFromDisplayValue(e.target.value);
		updateIdentities(identity.identityId, 'zimbraPrefFromDisplay', e.target.value);
	};

	const fromAddressLabel = useMemo(
		() => (fromAddress ? '' : t('label.address', 'Address')),
		[fromAddress, t]
	);

	const onChangeFromAddress = useCallback<SingleSelectionOnChange>(
		(newAddress) => {
			if (!newAddress) {
				return;
			}

			if (fromAddress?.value === newAddress) {
				return;
			}
			setFromAddress(filter(fromAddressArray, (item) => item.value === newAddress)[0]);
			updateIdentities(identity.identityId, 'zimbraPrefFromAddress', newAddress);
		},
		[identity.identityId, updateIdentities, fromAddressArray, fromAddress.value]
	);

	const replyToEnabledLabel = t(
		'label.set_reply_to_field',
		'Set the "Reply-to" field of e-mail message to:'
	);

	const replyToDisplayLabel = useMemo(
		() => (replyToDisplay ? '' : t('label.reply_to_field_example', 'e.g. Bob Smith')),
		[t, replyToDisplay]
	);
	const onChangePrefReplyToDisplay = useCallback<NonNullable<InputProps['onChange']>>(
		(e) => {
			setReplyToDisplay(e.target.value);
			updateIdentities(identity.identityId, 'zimbraPrefReplyToDisplay', e.target.value);
		},
		[updateIdentities, identity.identityId]
	);

	const replyToAddressLabel = useMemo(
		() => (replyToAddress ? '' : t('label.choose_account', 'Choose an account')),
		[t, replyToAddress]
	);

	const onChangeReplyToAddress = useCallback(
		(value: string) => {
			setReplyToAddress(value);
			updateIdentities(identity.identityId, 'zimbraPrefReplyToAddress', value);
		},
		[updateIdentities, identity.identityId]
	);

	const replyToAddressArray = useMemo(
		(): DropdownItem[] => [
			{
				id: '0',
				label: identity.fromAddress ?? '',
				onClick: () => onChangeReplyToAddress(identity.fromAddress ?? '')
			}
		],
		[identity.fromAddress, onChangeReplyToAddress]
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
				<Row
					width={isExternalAccount ? '100%' : '50%'}
					padding={{ right: isExternalAccount ? '' : 'small' }}
				>
					{/* zimbraPrefFromDisplay */}
					<Input
						label={fromDisplayLabel}
						value={fromDisplayValue}
						onChange={onChangeFromDisplayValue}
					/>
				</Row>
				{!isExternalAccount && (
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
				)}
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
