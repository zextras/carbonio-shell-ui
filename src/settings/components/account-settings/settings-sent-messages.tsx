/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo, useCallback, ReactElement, useState, useEffect } from 'react';
import {
	Container,
	Text,
	Padding,
	Input,
	Row,
	Select,
	Checkbox,
	Dropdown,
	Icon
} from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';
import { filter, find } from 'lodash';
import { IdentityProps, Mods } from '../../../../types';
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
	setSaveIsDisabled: (isDisabled: boolean) => void;
	mods: Mods;
};

const SettingsSentMessages = ({
	t,
	items,
	isExternalAccount,
	updateIdentities,
	setSaveIsDisabled,
	mods
}: SettingsSentMessagesProps): ReactElement => {
	const title = useMemo(() => t('label.settings_sent_messages', 'Settings for Sent Messages'), [t]);
	const [replyToEnabled, setReplyToEnabled] = useState(items.replyToEnabled === 'TRUE');
	const [replyToAddress, setReplyToAddress] = useState(items.replyToAddress);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [fromDisplayValue, setFromDisplayValue] = useState(items.fromDisplay);
	const [replyToDisplay, setReplyToDisplay] = useState(items?.replyToDisplay);
	const fromAddressArray = useMemo(
		() => [{ value: items.fromAddress, label: items.fromAddress }],
		[items]
	);
	const [fromAddress, setFromAddress] = useState(() =>
		find(fromAddressArray, (item) => item.value === items.fromAddress)
	);

	useEffect(() => {
		setReplyToEnabled(items.replyToEnabled === 'TRUE');
		setFromDisplayValue(items.fromDisplay);
		setFromAddress(filter(fromAddressArray, (item) => item.value === items.fromAddress)[0]);
		setReplyToDisplay(items?.replyToDisplay === undefined ? '' : items?.replyToDisplay);
		setReplyToAddress(items.replyToAddress);
	}, [
		fromAddressArray,
		items.fromAddress,
		items.fromDisplay,
		items.replyToAddress,
		items?.replyToDisplay,
		items.replyToEnabled
	]);

	const checkboxOnClick = useCallback(() => {
		setReplyToEnabled(!replyToEnabled);
		const modifyProp = {
			id: items.identityId,
			key: 'zimbraPrefReplyToEnabled',
			value: replyToEnabled ? 'FALSE' : 'TRUE'
		};
		updateIdentities(modifyProp);
	}, [items.identityId, replyToEnabled, updateIdentities]);

	const fromDisplayLabel = useMemo(
		() => (fromDisplayValue ? '' : t('label.from_name', 'From: "Name"')),
		[t, fromDisplayValue]
	);
	const onChangeFromDisplayValue = (
		ev: MouseEvent & {
			target: HTMLButtonElement;
		}
	): void => {
		setFromDisplayValue(ev.target.value);
		const modifyProp = {
			id: items.identityId,
			key: 'zimbraPrefFromDisplay',
			value: ev.target.value
		};
		updateIdentities(modifyProp);
	};

	const fromAddressLabel = useMemo(
		() => (replyToAddress ? '' : t('label.address', 'Address')),
		[replyToAddress, t]
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

	const checkboxLabel = useMemo(
		() => t('label.set_reply_to_field', 'Set the "Reply-to" field of e-mail message to:'),
		[t]
	);

	const replyToDisplayLabel = useMemo(
		() => (replyToDisplay ? '' : t('label.reply_to_field_example', 'e.g. Bob Smith')),
		[t, replyToDisplay]
	);
	const onChangePrefReplyToDisplay = useCallback(
		(
			ev: MouseEvent & {
				target: HTMLButtonElement;
			}
		): void => {
			setReplyToDisplay(ev.target.value);
			const modifyProp = {
				id: items.identityId,
				key: 'zimbraPrefReplyToDisplay',
				value: ev.target.value
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
				label: items.fromAddress,
				click: (ev: MouseEvent & { target: string & { textContent: string } }): void =>
					setReplyToAddress(ev.target.textContent)
			}
		],
		[items]
	);

	const onChangeReplyToAddress = useCallback(
		(ev) => {
			setReplyToAddress(ev.target.value);
			const modifyProp = {
				id: items.identityId,
				key: 'zimbraPrefReplyToAddress',
				value: ev.target.value
			};
			updateIdentities(modifyProp);
		},
		[updateIdentities, items.identityId]
	);

	const isValidEmail = useMemo(
		() => replyToEnabled && !EMAIL_VALIDATION_REGEX.test(replyToAddress || ''),
		[replyToEnabled, replyToAddress]
	);

	useEffect(() => {
		if (mods?.identity) {
			setSaveIsDisabled(isValidEmail);
		}
	}, [mods, isValidEmail, setSaveIsDisabled]);

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
						onChange={(
							ev: MouseEvent & {
								target: HTMLButtonElement;
							}
						): void => onChangeFromDisplayValue(ev)}
						background="gray5"
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
					label={checkboxLabel}
					value={replyToEnabled}
					onClick={(): void => checkboxOnClick()}
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
						background="gray5"
						disabled={!replyToEnabled}
						onChange={(
							ev: MouseEvent & {
								target: HTMLButtonElement;
							}
						): void => onChangePrefReplyToDisplay(ev)}
					/>
				</Row>
				<Row width="50%">
					<Dropdown
						items={replyToAddressArray}
						placement="bottom-start"
						style={{ flexGrow: '1' }}
						onClose={(): void => setDropdownOpen(false)}
						onOpen={(): void => setDropdownOpen(true)}
						disabled={!replyToEnabled}
					>
						<Input
							label={replyToAddressLabel}
							value={replyToAddress}
							items={replyToAddressArray}
							onChange={(
								ev: MouseEvent & {
									target: HTMLButtonElement;
								}
							): void => onChangeReplyToAddress(ev)}
							background="gray5"
							hasError={replyToEnabled && !EMAIL_VALIDATION_REGEX.test(replyToAddress || '')}
							CustomIcon={(): ReactElement => (
								<Icon icon={dropdownOpen ? 'ArrowUp' : 'ArrowDown'} />
							)}
							disabled={!replyToEnabled}
						/>
					</Dropdown>
				</Row>
			</Row>
			<Padding bottom="large" />
		</>
	);
};

export default SettingsSentMessages;
