/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, ReactElement, useContext, useRef, useMemo } from 'react';

import {
	Container,
	Text,
	Divider,
	Row,
	Padding,
	Button,
	Icon,
	ModalManagerContext,
	ListV2,
	ListItem
} from '@zextras/carbonio-design-system';
import { map } from 'lodash';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Identity, IdentityAttrs } from '../../../../types';
import { isPrimary } from '../utils';

const List = styled(ListV2)`
	flex-shrink: 0;
`;

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
	accountName: string;
	identities: Array<Identity>;
	identitiesDefault: Array<Identity>;
	selectedIdentityId: number;
	setSelectedIdentityId: (value: number) => void;
	removeIdentity: (identityId: string) => void;
	addIdentity: (id: string, identityAttrs: IdentityAttrs) => void;
};

const AccountsList = ({
	accountName,
	selectedIdentityId,
	identities,
	identitiesDefault,
	setSelectedIdentityId,
	removeIdentity,
	addIdentity
}: AccountsListProps): ReactElement => {
	const [t] = useTranslation();

	const createModal = useContext(ModalManagerContext);

	const createListRequestIdRef = useRef(0);
	const addNewPersona = useCallback(() => {
		const unavailableIdentityNames = map<Identity, string>(
			[...identitiesDefault, ...identities],
			(item) => item._attrs?.zimbraPrefIdentityName || ''
		);
		const newPersonaName = getNewPersonaNextIdentityName(1, unavailableIdentityNames);

		addIdentity(`${createListRequestIdRef.current}`, {
			zimbraPrefIdentityName: newPersonaName,
			zimbraPrefFromDisplay: identities[0]._attrs?.zimbraPrefFromDisplay,
			zimbraPrefFromAddress: identities[0]._attrs?.zimbraPrefFromAddress,
			zimbraPrefFromAddressType: 'sendAs',
			zimbraPrefReplyToEnabled: 'FALSE'
		});
		createListRequestIdRef.current += 1;
		setSelectedIdentityId(identities.length);
	}, [identitiesDefault, identities, addIdentity, setSelectedIdentityId]);

	const onConfirmDelete = useCallback((): void => {
		removeIdentity(identities[selectedIdentityId].id);
		setSelectedIdentityId(selectedIdentityId - 1);
	}, [identities, removeIdentity, selectedIdentityId, setSelectedIdentityId]);
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

	const items = useMemo(
		() =>
			map(identities, (item, index) => (
				<ListItem key={item.id} active={selectedIdentityId === index}>
					{(): React.JSX.Element => (
						<>
							<Container
								role={'listitem'}
								data-testid={`account-list-item-${item._attrs?.zimbraPrefIdentityId}`}
								onClick={(): void => {
									setSelectedIdentityId(index);
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
												{item._attrs?.zimbraPrefIdentityName}
											</Text>
										</Padding>
										<Padding right="small">
											<Text weight="regular" size="small" color="secondary">
												({isPrimary(item) ? accountName : item._attrs?.zimbraPrefFromAddress})
											</Text>
										</Padding>
									</Container>
									<Container width="fit" mainAlignment="flex-end">
										<Text weight="regular" size="small">
											{isPrimary(item)
												? t('label.primary', 'Primary')
												: t('label.persona', 'Persona')}
										</Text>
									</Container>
								</Row>
							</Container>
							<Divider />
						</>
					)}
				</ListItem>
			)),
		[accountName, identities, selectedIdentityId, setSelectedIdentityId, t]
	);

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
				<List>{items}</List>
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
					disabled={isPrimary(identities[selectedIdentityId])}
				/>
			</Row>
			<Padding bottom="large" />
		</>
	);
};

export default AccountsList;
