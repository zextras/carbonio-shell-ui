/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Checkbox, Container, Input, Padding, Row, Text } from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { IdentityProps } from '../../../../types';
import { EMAIL_VALIDATION_REGEX } from '../../../constants';

type PersonaUseSectionProps = {
	t: TFunction;
	identity: IdentityProps;
	updateIdentities: (modifyList: {
		id: string | number;
		key: string;
		value: string | boolean;
	}) => void;
};

const PersonaUseSection = ({
	t,
	identity,
	updateIdentities
}: PersonaUseSectionProps): ReactElement => {
	const title = useMemo(() => t('label.use_persona', 'Use this persona'), [t]);
	const whenSentToLabel = t('label.when_replying', 'When replying or forwarding messages sent to:');

	// this code is work in progress for when the mails sync is implemented
	// const [open, setOpen] = useState(false);
	// const onClose = useCallback(() => setOpen(false), []);

	const [whenInFoldersEnabled, setWhenInFoldersEnabled] = useState(
		identity.whenInFoldersEnabled === 'TRUE'
	);
	const [whenSentToEnabled, setWhenSentToEnabled] = useState(identity.whenSentToEnabled === 'TRUE');
	const [whenSentToAddresses, setWhenSentToAddresses] = useState(identity.whenSentToAddresses);

	useEffect(() => {
		setWhenSentToEnabled(identity.whenSentToEnabled === 'TRUE');
	}, [identity.whenSentToEnabled]);
	useEffect(() => {
		setWhenSentToAddresses(identity.whenSentToAddresses);
	}, [identity.whenSentToAddresses]);
	useEffect(() => {
		setWhenInFoldersEnabled(identity.whenInFoldersEnabled === 'TRUE');
	}, [identity.whenInFoldersEnabled]);

	const whenSentToAddressesLabel = useMemo(
		() => (whenSentToAddresses ? '' : t('label.recipents', 'Recipients')),
		[t, whenSentToAddresses]
	);
	const onClickWhenSentToEnabled = useCallback(() => {
		setWhenSentToEnabled(!whenSentToEnabled);
		const modifyProp = {
			id: identity.identityId,
			key: 'zimbraPrefWhenSentToEnabled',
			value: whenSentToEnabled ? 'FALSE' : 'TRUE'
		};
		updateIdentities(modifyProp);
	}, [identity.identityId, updateIdentities, whenSentToEnabled]);

	const isValidEmail = useMemo(
		() => whenSentToEnabled && !EMAIL_VALIDATION_REGEX.test(whenSentToAddresses || ''),
		[whenSentToAddresses, whenSentToEnabled]
	);

	const onChangeWhenSentToAddresses = useCallback(
		(value: string) => {
			setWhenSentToAddresses(value);
			const modifyProp = {
				id: identity.identityId,
				key: 'zimbraPrefWhenSentToAddresses',
				value
			};

			updateIdentities(modifyProp);
		},
		[updateIdentities, identity.identityId]
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
				minWidth="calc(min(100%, 32rem))"
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
