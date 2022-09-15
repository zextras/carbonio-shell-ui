/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo, useEffect, ReactElement, useState, useCallback } from 'react';
import { Container, Text, Padding, Input, Row, Checkbox } from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';
import { IdentityProps } from '../../../../types';
import { EMAIL_VALIDATION_REGEX } from '../../../constants';

type PersonaUseSectionProps = {
	t: TFunction;
	items: IdentityProps;
	updateIdentities: (modifyList: {
		id: string | number;
		key: string;
		value: string | boolean;
	}) => void;
};

const PersonaUseSection = ({
	t,
	items,
	updateIdentities
}: PersonaUseSectionProps): ReactElement => {
	const title = useMemo(() => t('label.use_persona', 'Use this persona'), [t]);
	const whenSentToLabel = useMemo(
		() => t('label.when_replying', 'When replying or forwarding messages sent to:'),
		[t]
	);
	// this code is work in progress for when the mails sync is implemented
	// const [open, setOpen] = useState(false);
	// const onClose = useCallback(() => setOpen(false), []);

	const [whenInFoldersEnabled, setWhenInFoldersEnabled] = useState(
		items.whenInFoldersEnabled === 'TRUE'
	);
	const [whenSentToEnabled, setWhenSentToEnabled] = useState(items.whenSentToEnabled === 'TRUE');
	const [whenSentToAddresses, setWhenSentToAddresses] = useState(items.whenSentToAddresses);

	useEffect(() => {
		setWhenSentToEnabled(items.whenSentToEnabled === 'TRUE');
	}, [items.whenSentToEnabled]);
	useEffect(() => {
		setWhenSentToAddresses(items.whenSentToAddresses);
	}, [items.whenSentToAddresses]);
	useEffect(() => {
		setWhenInFoldersEnabled(items.whenInFoldersEnabled === 'TRUE');
	}, [items.whenInFoldersEnabled]);

	const whenSentToAddressesLabel = useMemo(
		() => (whenSentToAddresses ? '' : t('label.recipents', 'Recipients')),
		[t, whenSentToAddresses]
	);
	const onClickWhenSentToEnabled = useCallback(() => {
		setWhenSentToEnabled(!whenSentToEnabled);
		const modifyProp = {
			id: items.identityId,
			key: 'zimbraPrefWhenSentToEnabled',
			value: whenSentToEnabled ? 'FALSE' : 'TRUE'
		};
		updateIdentities(modifyProp);
	}, [items.identityId, updateIdentities, whenSentToEnabled]);

	const isValidEmail = useMemo(
		() => whenSentToEnabled && !EMAIL_VALIDATION_REGEX.test(whenSentToAddresses || ''),
		[whenSentToAddresses, whenSentToEnabled]
	);

	const onChangeWhenSentToAddresses = useCallback(
		(value: string) => {
			setWhenSentToAddresses(value);
			const modifyProp = {
				id: items.identityId,
				key: 'zimbraPrefWhenSentToAddresses',
				value
			};

			updateIdentities(modifyProp);
		},
		[updateIdentities, items.identityId]
	);

	// this function is work in progress for when the mails sync is implemented
	// const onClickWhenInFoldersEnabled = useCallback(() => {
	// 	setWhenInFoldersEnabled(!whenInFoldersEnabled);
	// 	if (!whenInFoldersEnabled === (items.whenInFoldersEnabled === 'TRUE')) {
	// 		setMods({});
	// 	} else {
	// 		updateIdentities(
	// 			items.identityId,
	// 			'zimbraPrefWhenInFoldersEnabled',
	// 			items.whenInFoldersEnabled ? 'TRUE' : 'FALSE'
	// 		);
	// 	}
	// }, [
	// 	items.whenInFoldersEnabled,
	// 	whenInFoldersEnabled,
	// 	setMods,
	// 	updateIdentities,
	// 	items.identityId
	// ]);
	// const modalProps = useMemo(
	// 	() => ({
	// 		open,
	// 		onClose,
	// 		setFolder,
	// 		t
	// 	}),
	// 	[open, onClose, setFolder, t]
	// );

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
				background="gray6"
				mainAlignment="flex-start"
				padding={{ horizontal: 'large', bottom: 'large' }}
			>
				<Checkbox
					label={whenSentToLabel}
					value={whenSentToEnabled}
					onClick={onClickWhenSentToEnabled}
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
						label={whenSentToAddressesLabel}
						value={whenSentToAddresses}
						disabled={!whenSentToEnabled}
						hasError={isValidEmail}
						onChange={(ev): void => onChangeWhenSentToAddresses(ev.target.value)}
					/>
				</Row>
			</Row>
			{/* <Row
				width="fill"
				background="gray6"
				mainAlignment="flex-start"
				padding={{ horizontal: 'large', bottom: 'large' }}
			>
				<Checkbox
					label={t(
						'label.when_composing',
						'When composing, replying to or forwarding messages in folder(s):'
					)}
					value={whenInFoldersEnabled}
					onClick={(): void => onClickWhenInFoldersEnabled()}
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
					<ChipInput
						label={t('label.reply_to_field_example', "e.g. Bob Smith")}
						value=""
						placeholder={t('label.folders', 'Folders')}
						background="gray5"
						icon="FolderOutline"
						disabled={!whenInFoldersEnabled}
						iconAction={openFolderModal}
					/>
				</Row>
			</Row> */}

			<Padding bottom="large" />
			{/* <FolderSelectModal compProps={modalProps} /> */}
		</>
	);
};

export default PersonaUseSection;
