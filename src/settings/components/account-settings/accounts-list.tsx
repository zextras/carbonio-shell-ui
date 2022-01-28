/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, ReactElement, useMemo, useState } from 'react';
import {
	Container,
	Text,
	List,
	Divider,
	Row,
	Padding,
	Button,
	Icon
} from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';
import { map, filter, max } from 'lodash';
import { IdentityProps, CreateIdentityProps } from '../../../../types';
import ConfirmDeleteModal from './confirm-delete-modal';

type AccountsListProps = {
	t: TFunction;
	identities: IdentityProps[];
	setIdentities: (identities: IdentityProps[]) => void;
	selectedIdentityId: number;
	setSelectedIdentityId: (value: number) => void;
	setMods: (mods: { [key: string]: unknown }) => void;
	deleteIdentities: (deleteList: string[]) => void;
	createIdentities: (createList: { pref: CreateIdentityProps }[]) => void;
};

type ListItemProps = {
	active: boolean;
	item: IdentityProps;
	selected: boolean;
	setSelected: () => void;
	background: string;
	selectedBackground: string;
	activeBackground: string;
};

const AccountsList = ({
	t,
	selectedIdentityId,
	identities,
	setIdentities,
	setSelectedIdentityId,
	setMods,
	deleteIdentities,
	createIdentities
}: AccountsListProps): ReactElement => {
	const changeView = (value: number): void => {
		if (Number(identities[selectedIdentityId]?.id) !== value) {
			setSelectedIdentityId(value);
			setMods({});
		}
	};
	const [openModal, setOpenModal] = useState(false);
	const ListItem = ({ item }: ListItemProps): ReactElement => (
		<>
			<Container
				onClick={(): void => {
					changeView(Number(item.id));
				}}
				orientation="horizontal"
				mainAlignment="flex-start"
				padding={{ all: 'small' }}
			>
				<Row width="fill" mainAlignment="space-between">
					<Container orientation="horizontal" mainAlignment="flex-start" width="fit">
						<Padding right="small">
							<Icon icon="CheckmarkCircle2Outline" size="large" color="primary" />
						</Padding>
						<Padding right="small">
							<Text weight="regular" size="small">
								{item.identityName}
							</Text>
						</Padding>
						<Padding right="small">
							<Text weight="regular" size="small" color="secondary">
								({item.fromAddress})
							</Text>
						</Padding>
					</Container>
					<Container width="fit" mainAlignment="flex-end">
						<Text weight="regular" size="small">
							{item.type}
						</Text>
					</Container>
				</Row>

				<Row width="fit"></Row>
			</Container>
			<Divider />
		</>
	);

	const [createListrequestId, setCreateListrequestId] = useState(0);
	const createList = useMemo((): any => [], []);
	const addNewPersona = useCallback(() => {
		const newPersonaNextNumber =
			Number(
				max([
					...filter(
						map(
							map(
								filter(identities, (item) => item.identityName?.includes('New Persona')),
								(item: IdentityProps) => item.identityName
							),
							(item: string) => parseFloat(item.replace('New Persona ', ''))
						),
						(item) => Number(item)
					)
				])
			) + 1;
		const newPersonaName = `New Persona ${newPersonaNextNumber || 1}`;
		identities.push({
			id: Object.keys(identities).length.toString(),
			type: t('label.persona', 'Persona'),
			identityId: '',
			fromAddress: identities[0]?.fromAddress,
			identityName: newPersonaName,
			fromDisplay: identities[0]?.fromDisplay,
			replyToDisplay: '',
			replyToAddress: '',
			replyToEnabled: 'FALSE',
			saveToSent: '',
			sentMailFolder: '',
			whenInFoldersEnabled: '',
			whenSentToEnabled: ''
		});
		setIdentities(identities);
		setCreateListrequestId(createListrequestId + 1);
		createList.push({
			prefs: {
				requestId: createListrequestId,
				zimbraPrefIdentityName: newPersonaName,
				zimbraPrefFromDisplay: identities[0]?.fromDisplay,
				zimbraPrefFromAddress: identities[0]?.fromAddress
			}
		});
		createIdentities(createList);
		setSelectedIdentityId(identities.length - 1);
	}, [
		identities,
		setIdentities,
		t,
		createIdentities,
		createListrequestId,
		createList,
		setSelectedIdentityId
	]);

	const isDisabled = false;

	const deleteList = useMemo((): string[] => [], []);
	const onDelete = useCallback((): void => {
		setOpenModal(false);
		const newIdentities = map(
			filter(
				identities,
				(identity) => identity?.identityId !== identities[selectedIdentityId]?.identityId
			),
			(item: IdentityProps, index: number) => ({ ...item, id: index.toString() })
		);
		deleteList.push(identities[selectedIdentityId]?.identityId);
		setIdentities(newIdentities);
		deleteIdentities(deleteList);
	}, [identities, selectedIdentityId, setIdentities, deleteList, deleteIdentities]);

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
					<Text weight="bold">{t('label.accounts_list', 'Accounts list')}</Text>
				</Padding>
				<List
					items={identities}
					ItemComponent={ListItem}
					active={identities[selectedIdentityId]?.id}
					height="fit"
					selectedIdentityId={selectedIdentityId}
					setSelectedIdentityId={setSelectedIdentityId}
				/>
			</Container>
			<Row
				padding={{ horizontal: 'large', bottom: 'large' }}
				width="fill"
				mainAlignment="flex-start"
				background="gray6"
			>
				<Padding right="small">
					<Button
						label={t('label.add_external_account', 'Add external account')}
						// onClick={(): void => setSelectedIdentity({ type: 'POP' })}
						color="primary"
						type="outlined"
						disabled
					/>
				</Padding>
				<Padding right="small">
					<Button
						label={t('label.add_persona', 'Add persona')}
						onClick={(): void => addNewPersona()}
						color="primary"
						type="outlined"
						disabled={isDisabled}
					/>
				</Padding>
				<Button
					label={t('label.delete', 'Delete')}
					onClick={(): void => setOpenModal(true)}
					color="error"
					type="outlined"
					disabled={identities[selectedIdentityId]?.type === t('label.primary', 'Primary')}
				/>
				{/* <//Row> */}
			</Row>
			<Padding bottom="large" />
			<ConfirmDeleteModal
				t={t}
				onConfirm={onDelete}
				setOpenModal={setOpenModal}
				openModal={openModal}
			/>
		</>
	);
};

export default AccountsList;
