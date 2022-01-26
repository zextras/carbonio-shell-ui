/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo, useEffect, ReactElement, useState, useCallback } from 'react';
import { Container, Text, Padding, Input, Row, Checkbox } from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';
import { IdentityProps } from '../../../../types';
import { REGEX_VALIDATION } from '../../../constants';

type UsePersonaProps = {
	t: TFunction;
	items: IdentityProps;
	setMods: (mods: { [key: string]: unknown }) => void;
	updateIdentities: (id: string, key: string, pref: string) => void;
};

const UsePersona = ({ t, items, setMods, updateIdentities }: UsePersonaProps): ReactElement => {
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
		setWhenSentToAddresses(items.whenSentToAddresses);
		setWhenInFoldersEnabled(items.whenInFoldersEnabled === 'TRUE');
	}, [items.whenSentToAddresses, items.whenInFoldersEnabled, items.whenSentToEnabled]);

	const whenSentToAddressesLabel = useMemo(
		() => (whenSentToAddresses === (undefined || '') ? t('label.recipents', 'Recipients') : ''),
		[t, whenSentToAddresses]
	);
	const onClickWhenSentToEnabled = useCallback(() => {
		setWhenSentToEnabled(!whenSentToEnabled);
		if (!whenSentToEnabled === (items.whenSentToEnabled === 'TRUE')) {
			setMods({});
		} else {
			updateIdentities(
				items.identityId,
				'zimbraPrefWhenSentToEnabled',
				items.whenSentToEnabled ? 'TRUE' : 'FALSE'
			);
		}
	}, [items.whenSentToEnabled, whenSentToEnabled, setMods, updateIdentities, items.identityId]);

	const onChangeWhenSentToAddresses = useCallback(
		(ev) => {
			setWhenSentToAddresses(ev.target.value);
			if (
				whenSentToAddresses === items.whenSentToAddresses ||
				!REGEX_VALIDATION.test(ev.target.value)
			) {
				setMods({});
			} else {
				updateIdentities(items.identityId, 'zimbraPrefWhenSentToAddresses', ev.target.value);
			}
		},
		[items.whenSentToAddresses, whenSentToAddresses, setMods, updateIdentities, items.identityId]
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
					onClick={(): void => onClickWhenSentToEnabled()}
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
						background="gray5"
						disabled={!whenSentToEnabled}
						onChange={(
							ev: MouseEvent & {
								target: HTMLButtonElement;
							}
						): void => onChangeWhenSentToAddresses(ev)}
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
						label="e.g. Bob Smith"
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

export default UsePersona;
