/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import { Checkbox, Container, Input, Padding, Row, Text } from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';

import { IdentityAttrs, IdentityProps } from '../../../../types';
import { EMAIL_VALIDATION_REGEX } from '../../../constants';

type PersonaUseSectionProps = {
	t: TFunction;
	identity: IdentityProps;
	updateIdentities: <K extends keyof IdentityAttrs>(
		id: string | number,
		key: K,
		value: IdentityAttrs[K]
	) => void;
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
		setWhenSentToEnabled((prevState) => {
			const newState = !prevState;
			updateIdentities(
				identity.identityId,
				'zimbraPrefWhenSentToEnabled',
				newState ? 'TRUE' : 'FALSE'
			);
			return newState;
		});
	}, [identity.identityId, updateIdentities]);

	const isValidEmail = useMemo(
		() => whenSentToEnabled && !EMAIL_VALIDATION_REGEX.test(whenSentToAddresses || ''),
		[whenSentToAddresses, whenSentToEnabled]
	);

	const onChangeWhenSentToAddresses = useCallback(
		(value: string) => {
			setWhenSentToAddresses(value);
			// TODO improve array usage or type
			// Server accepts '' and [] considering following scenarios.
			// 1. 'Single email / folder id' for single item. - Legacy follow this.
			// 2. Array [email, ...] for 1 or more items.
			// 3. '' to set value to empty. (Refer following cases)
			// > [] - No changes to reflect on server.
			// > '' - Set value to empty for given field.
			updateIdentities(identity.identityId, 'zimbraPrefWhenSentToAddresses', [value]);
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
