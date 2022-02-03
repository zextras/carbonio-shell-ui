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
import { IdentityProps } from '../../../../types';

type SettingsSentMessagesProps = {
	t: TFunction;
	items: IdentityProps;
	isExternalAccount: boolean;
	setMods: (mods: { [key: string]: unknown }) => void;
	updateIdentities: (id: string, key: string, prefs: string) => void;
};

const SettingsSentMessages = ({
	t,
	items,
	isExternalAccount,
	setMods,
	updateIdentities
}: SettingsSentMessagesProps): ReactElement => {
	const title = useMemo(() => t('label.settings_sent_messages', 'Settings for Sent Messages'), [t]);

	const [replyToEnabled, setReplyToEnabled] = useState(items.replyToEnabled === 'TRUE');

	useEffect(() => {
		setReplyToEnabled(items.replyToEnabled === 'TRUE');
	}, [items.replyToEnabled]);

	const checkboxOnClick = useCallback(() => {
		setReplyToEnabled(!replyToEnabled);
		if (!replyToEnabled === (items.replyToEnabled === 'TRUE')) {
			setMods({});
		} else {
			updateIdentities(
				items.identityId,
				'zimbraPrefReplyToEnabled',
				replyToEnabled ? 'FALSE' : 'TRUE'
			);
		}
	}, [items.replyToEnabled, replyToEnabled, setMods, updateIdentities, items.identityId]);

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [fromDisplayValue, setFromDisplayValue] = useState(items.fromDisplay || ' ');
	useEffect(() => {
		setFromDisplayValue(items.fromDisplay || ' ');
	}, [items.fromDisplay]);

	const fromDisplayLabel = useMemo(
		() => (fromDisplayValue === (undefined || '') ? t('label.from_name', 'From: "Name"') : ''),
		[t, fromDisplayValue]
	);
	const onChangeFromDisplayValue = (
		ev: MouseEvent & {
			target: HTMLButtonElement;
		}
	): void => {
		setFromDisplayValue(ev.target.value);
		if (ev.target.value === items.fromDisplay) {
			setMods({});
		} else {
			updateIdentities(items.identityId, 'zimbraPrefFromDisplay', ev.target.value);
		}
	};

	const fromAddressLabel = useMemo(() => t('label.address', 'Address'), [t]);
	const fromAddressArray = useMemo(
		() => [{ value: items.fromAddress, label: items.fromAddress }],
		[items]
	);
	const [fromAddress, setFromAddress] = useState(() =>
		find(fromAddressArray, (item) => item.value === items.fromAddress)
	);
	useEffect(
		() => setFromAddress(filter(fromAddressArray, (item) => item.value === items.fromAddress)[0]),
		[items.fromAddress, fromAddressArray]
	);

	const onChangeFromAddress = useCallback(
		(newVal) => {
			setFromAddress(filter(fromAddressArray, (item) => item.value === newVal)[0]);
			if (newVal === items.fromAddress) {
				setMods({});
			} else {
				updateIdentities(items.identityId, 'zimbraPrefFromAddress', newVal);
			}
		},
		[items?.fromAddress, items.identityId, updateIdentities, setMods, fromAddressArray]
	);

	const checkboxLabel = useMemo(
		() => t('label.set_reply_to_field', 'Set the "Reply-to" field of e-mail message to:'),
		[t]
	);
	const [replyToDisplay, setReplyToDisplay] = useState(items?.replyToDisplay || ' ');
	useEffect(() => {
		setReplyToDisplay(items?.replyToDisplay === undefined ? '' : items?.replyToDisplay);
	}, [items?.replyToDisplay]);
	const replyToDisplayLabel = useMemo(
		() =>
			replyToDisplay === (undefined || '')
				? t('label.reply_to_field_example', 'e.g. Bob Smith')
				: ' ',
		[t, replyToDisplay]
	);
	const onChangePrefReplyToDisplay = useCallback(
		(
			ev: MouseEvent & {
				target: HTMLButtonElement;
			}
		): void => {
			setReplyToDisplay(ev.target.value);
			if (ev.target.value === items?.replyToDisplay) {
				setMods({});
			} else {
				updateIdentities(items.identityId, 'zimbraPrefReplyToDisplay', ev.target.value);
			}
		},
		[updateIdentities, items?.replyToDisplay, items.identityId, setMods]
	);

	const [replyToAddress, setReplyToAddress] = useState(items.replyToAddress);

	const replyToAddressLabel = useMemo(
		() =>
			replyToAddress === (undefined || '') ? t('label.choose_account', 'Choose an account') : ' ',
		[t, replyToAddress]
	);
	useEffect(() => setReplyToAddress(items.replyToAddress), [items.replyToAddress]);

	const replyToAddressArray = useMemo(
		() => [
			{
				id: '0',
				label: items.fromAddress || ' ',
				click: (ev: MouseEvent & { target: string & { textContent: string } }): void =>
					setReplyToAddress(ev.target.textContent)
			}
		],
		[items]
	);

	const onChangeReplyToAddress = useCallback(
		(ev) => {
			setReplyToAddress(ev.target.value);
			if (ev.target.value === items.replyToAddress) {
				setMods({});
			} else {
				updateIdentities(items.identityId, 'zimbraPrefReplyToAddress', ev.target.value);
			}
		},
		[items?.replyToAddress, updateIdentities, setMods, items.identityId]
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
							value={replyToAddress || ' '}
							items={replyToAddressArray}
							onChange={(
								ev: MouseEvent & {
									target: HTMLButtonElement;
								}
							): void => onChangeReplyToAddress(ev)}
							background="gray5"
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
