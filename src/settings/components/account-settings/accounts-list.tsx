/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { ReactElement } from 'react';
import React, { useCallback, useRef, useMemo } from 'react';

import {
	Container,
	Text,
	Row,
	Padding,
	Icon,
	List,
	ListItem,
	useModal,
	FormSection,
	FormSubSection,
	Button,
	Divider
} from '@zextras/carbonio-design-system';
import type { TFunction } from 'i18next';
import { map } from 'lodash';
import { useTranslation } from 'react-i18next';

import type { Identity, IdentityAttrs } from '../../../types/account';
import { isPrimary } from '../utils';

function getNewPersonaNextIdentityName(
	numberToCheck: number,
	unavailableIdentityNames: Array<string>,
	t: TFunction
): string {
	const newPersonaNextIdentityName = t('settings.account.new_identity', {
		defaultValue: `New Persona {{number}}`,
		number: numberToCheck
	});
	if (unavailableIdentityNames.includes(newPersonaNextIdentityName)) {
		return getNewPersonaNextIdentityName(numberToCheck + 1, unavailableIdentityNames, t);
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

	const { createModal, closeModal } = useModal();

	const createListRequestIdRef = useRef(0);
	const addNewPersona = useCallback(() => {
		const unavailableIdentityNames = map<Identity, string>(
			[...identitiesDefault, ...identities],
			(item) => item._attrs?.zimbraPrefIdentityName ?? ''
		);
		const newPersonaName = getNewPersonaNextIdentityName(1, unavailableIdentityNames, t);

		addIdentity(`${createListRequestIdRef.current}`, {
			zimbraPrefIdentityName: newPersonaName,
			zimbraPrefFromDisplay: identities[0]._attrs?.zimbraPrefFromDisplay,
			zimbraPrefFromAddress: identities[0]._attrs?.zimbraPrefFromAddress,
			zimbraPrefFromAddressType: 'sendAs',
			zimbraPrefReplyToEnabled: 'FALSE'
		});
		createListRequestIdRef.current += 1;
		setSelectedIdentityId(identities.length);
	}, [identitiesDefault, identities, addIdentity, setSelectedIdentityId, t]);

	const onConfirmDelete = useCallback((): void => {
		removeIdentity(identities[selectedIdentityId].id);
		setSelectedIdentityId(selectedIdentityId - 1);
	}, [identities, removeIdentity, selectedIdentityId, setSelectedIdentityId]);

	const onDelete = useCallback((): void => {
		const modalId = 'delete-identity';
		createModal({
			id: modalId,
			title: t('label.permanent_delete_title', 'Are you sure to permanently delete this Persona?'),
			onConfirm: () => {
				onConfirmDelete();
				closeModal(modalId);
			},
			confirmLabel: t('label.delete_permanently', 'Delete permanently'),
			confirmColor: 'error',
			showCloseIcon: true,
			onClose: () => {
				closeModal(modalId);
			},
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
	}, [createModal, t, onConfirmDelete, closeModal]);

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
								height={'fit'}
							>
								<Row width="fill" mainAlignment="space-between">
									<Container
										orientation="horizontal"
										mainAlignment="flex-start"
										width="fit"
										gap={'0.5rem'}
									>
										<Icon icon="CheckmarkCircle2Outline" size="large" color="primary" />
										<Text weight="regular" size="small">
											{item._attrs?.zimbraPrefIdentityName}
										</Text>
										<Text weight="regular" size="small" color="secondary">
											({isPrimary(item) ? accountName : item._attrs?.zimbraPrefFromAddress})
										</Text>
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
			<FormSection label={t('label.accounts_list', 'Accounts list')}>
				<FormSubSection>
					<Container crossAlignment={'flex-start'} mainAlignment={'flex-start'} gap={'1rem'}>
						<List flexShrink={0} height={'fit'}>
							{items}
						</List>
						<Row width="fill" mainAlignment="flex-start" background="gray6" gap={'0.5rem'}>
							<Button
								label={t('label.add_persona', 'Add persona')}
								onClick={addNewPersona}
								color="primary"
								type="outlined"
							/>
							<Button
								label={t('label.delete', 'Delete')}
								onClick={onDelete}
								color="error"
								type="outlined"
								disabled={isPrimary(identities[selectedIdentityId])}
							/>
						</Row>
					</Container>
				</FormSubSection>
			</FormSection>
			<Padding bottom="large" />
		</>
	);
};

export default AccountsList;
