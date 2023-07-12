/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, ReactElement, useContext, useRef } from 'react';

import {
	Container,
	Text,
	List,
	Divider,
	Row,
	Padding,
	Button,
	Icon,
	ModalManagerContext,
	ItemComponentProps
} from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';
import { map, filter, max } from 'lodash';

import { IdentityProps, IdentityAttrs } from '../../../../types';

function getNewPersonaNextIdentityName(
	numberToCheck: number,
	unavailableIdentityNames: Array<string>
): string {
	const newPersonaNextIdentityName = `New Persona ${numberToCheck}`;
	if (unavailableIdentityNames.includes(newPersonaNextIdentityName)) {
		return getNewPersonaNextIdentityName(numberToCheck + 1, unavailableIdentityNames);
	}
	return newPersonaNextIdentityName;
}

export type AccountsListProps = {
	t: TFunction;
	accountName: string;
	identities: IdentityProps[];
	identitiesDefault: IdentityProps[];
	setIdentities: (identities: IdentityProps[]) => void;
	selectedIdentityId: number;
	setSelectedIdentityId: (value: number) => void;
	removeIdentity: (identityId: string | number) => void;
	addIdentity: (id: number, identityAttrs: IdentityAttrs) => void;
};

const AccountsList = ({
	t,
	accountName,
	selectedIdentityId,
	identities,
	identitiesDefault,
	setIdentities,
	setSelectedIdentityId,
	removeIdentity,
	addIdentity
}: AccountsListProps): ReactElement => {
	const changeView = (value: number): void => setSelectedIdentityId(value);

	const ListItem = ({ item }: ItemComponentProps<IdentityProps>): ReactElement => (
		<>
			<Container
				data-testid={`account-list-item-${item.identityId}`}
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
								({item.flgType === 'primary' ? accountName : item.fromAddress})
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

	const createListRequestIdRef = useRef(0);
	const addNewPersona = useCallback(() => {
		const unavailableIdentityNames = map<IdentityProps, string>(
			[...identitiesDefault, ...identities],
			(item) => item.identityName || ''
		);
		const newPersonaName = getNewPersonaNextIdentityName(1, unavailableIdentityNames);

		setIdentities([
			...identities,
			{
				id: `${identities.length}`,
				flgType: 'persona',
				type: t('label.persona', 'Persona'),
				identityId: createListRequestIdRef.current,
				fromAddress: identities[0]?.fromAddress,
				identityName: newPersonaName,
				fromDisplay: identities[0]?.fromDisplay,
				replyToEnabled: 'FALSE'
			}
		]);
		addIdentity(createListRequestIdRef.current, {
			zimbraPrefIdentityName: newPersonaName,
			zimbraPrefFromDisplay: identities[0]?.fromDisplay,
			zimbraPrefFromAddress: identities[0]?.fromAddress,
			zimbraPrefFromAddressType: 'sendAs',
			zimbraPrefReplyToEnabled: 'FALSE'
		});
		createListRequestIdRef.current += 1;
		setSelectedIdentityId(identities.length);
	}, [identitiesDefault, identities, setIdentities, t, addIdentity, setSelectedIdentityId]);

	const onConfirmDelete = useCallback((): void => {
		const newIdentities = map(
			filter(
				identities,
				(identity) => identity?.identityId !== identities[selectedIdentityId]?.identityId
			),
			(item: IdentityProps, index: number) => ({ ...item, id: index.toString() })
		);
		setIdentities(newIdentities);
		removeIdentity(identities[selectedIdentityId].identityId);
		setSelectedIdentityId(selectedIdentityId - 1);
	}, [identities, setIdentities, removeIdentity, selectedIdentityId, setSelectedIdentityId]);
	const onDelete = useCallback((): void => {
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
				minWidth="calc(min(100%, 32rem))"
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
						label={t('label.add_persona', 'Add persona')}
						onClick={addNewPersona}
						color="primary"
						type="outlined"
					/>
				</Padding>
				<Button
					label={t('label.delete', 'Delete')}
					onClick={onDelete}
					color="error"
					type="outlined"
					disabled={identities[selectedIdentityId]?.flgType === 'primary'}
				/>
			</Row>
			<Padding bottom="large" />
		</>
	);
};

export default AccountsList;
