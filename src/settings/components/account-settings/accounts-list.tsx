/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, ReactElement, useState, useContext, FC } from 'react';
import {
	Container,
	Text,
	List,
	Divider,
	Row,
	Padding,
	ButtonOld as Button,
	Icon,
	ModalManagerContext,
	ItemComponentProps
} from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';
import { map, filter, max } from 'lodash';
import { IdentityProps, CreateIdentityProps } from '../../../../types';
import { emptyFunction } from '../../../utils';

type AccountsListProps = {
	t: TFunction;
	identities: IdentityProps[];
	setIdentities: (identities: IdentityProps[]) => void;
	selectedIdentityId: number;
	setSelectedIdentityId: (value: number) => void;
	deleteIdentities: (deleteList: string[]) => void;
	createIdentities: (createList: { prefs: CreateIdentityProps }[]) => void;
};

type ListItemProps = {
	active: boolean;
	item: IdentityProps;
	selected: boolean;
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
	deleteIdentities,
	createIdentities
}: AccountsListProps): ReactElement => {
	const changeView = (value: number): void => setSelectedIdentityId(value);

	const ListItem = ({ item }: ItemComponentProps<IdentityProps>): ReactElement => (
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

	const createModal = useContext(ModalManagerContext);

	const [createListrequestId, setCreateListrequestId] = useState(0);
	const [createList, setCreateList] = useState<{ prefs: CreateIdentityProps }[]>([]);
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
			id: `${identities.length}`,
			type: t('label.persona', 'Persona'),
			identityId: createListrequestId,
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
		setCreateList((state) => {
			state.push({
				prefs: {
					requestId: createListrequestId,
					zimbraPrefIdentityName: newPersonaName,
					zimbraPrefFromDisplay: identities[0]?.fromDisplay,
					zimbraPrefFromAddress: identities[0]?.fromAddress,
					zimbraPrefFromAddressType: 'sendAs',
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefReplyToDisplay: '',
					zimbraPrefReplyToAddress: '',
					zimbraPrefDefaultSignatureId: '',
					zimbraPrefForwardReplySignatureId: '',
					zimbraPrefWhenSentToEnabled: 'FALSE',
					zimbraPrefWhenInFoldersEnabled: 'FALSE'
				}
			});
			return state;
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

	const [deleteList, setDeleteList] = useState<string[]>([]);
	const onConfirmDelete = useCallback((): void => {
		const newIdentities = map(
			filter(
				identities,
				(identity) => identity?.identityId !== identities[selectedIdentityId]?.identityId
			),
			(item: IdentityProps, index: number) => ({ ...item, id: index.toString() })
		);
		setDeleteList((state) => {
			state.push(identities[selectedIdentityId]?.identityId.toString());
			return state;
		});
		setIdentities(newIdentities);
		deleteIdentities(deleteList);
		setSelectedIdentityId(selectedIdentityId - 1);
	}, [
		identities,
		setIdentities,
		deleteIdentities,
		deleteList,
		setSelectedIdentityId,
		selectedIdentityId
	]);
	const onDelete = useCallback((): void => {
		// I'm disabling lint as the DS is not defining the type
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const closeModal = createModal({
			title: t('label.permanent_delete_title', 'Are you sure to permanently delete this Persona?'),
			onConfirm: () => {
				onConfirmDelete();
				closeModal();
			},
			confirmLabel: t('label.delete_permanently', 'Delete permanently'),
			confirmColor: 'error',
			showCloseIcon: true,
			onClose: () => closeModal(),
			children: (
				<Padding all="small">
					<Text overflow="break-word">
						{t(
							'messages.permanent_delete_body',
							'If you permanently delete this Persona you will not be able to recover it. Continue?'
						)}
					</Text>
				</Padding>
			)
		});
	}, [createModal, t, onConfirmDelete]);

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
						onClick={emptyFunction}
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
					/>
				</Padding>
				<Button
					label={t('label.delete', 'Delete')}
					onClick={(): void => onDelete()}
					color="error"
					type="outlined"
					disabled={identities[selectedIdentityId]?.type === t('label.primary', 'Primary')}
				/>
			</Row>
			<Padding bottom="large" />
		</>
	);
};

export default AccountsList;
