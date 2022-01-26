/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { ReactElement } from 'react';
import { TFunction } from 'i18next';
import { Container, Text, CustomModal } from '@zextras/carbonio-design-system';
import ModalHeader from '../folder-select-modal/modal-header';
import ModalFooter from '../folder-select-modal/modal-footer';

type DeleteConfirmProp = {
	t: TFunction;
	onConfirm: () => void;
	setOpenModal: (value: boolean) => void;
	openModal: boolean;
};

const ConfirmDeleteModal = ({
	t,
	onConfirm,
	openModal,
	setOpenModal
}: DeleteConfirmProp): ReactElement => (
	<>
		<CustomModal open={openModal} maxHeight="90vh" size="medium">
			<Container
				padding={{ all: 'large' }}
				mainAlignment="center"
				crossAlignment="flex-start"
				height="fit"
			>
				<ModalHeader
					onClose={(): void => setOpenModal(false)}
					title={t(
						'label.permanent_delete_title',
						'Are you sure to permanently delete this Persona?'
					)}
				/>
				<Container
					padding={{ all: 'small' }}
					mainAlignment="center"
					crossAlignment="flex-start"
					height="fit"
				>
					<Text overflow="break-word">
						{t(
							'messages.permanent_delete_body',
							'If you permanently delete this Persona you will not be able to recover it. Continue?'
						)}
					</Text>
					<ModalFooter
						onConfirm={(): void => onConfirm()}
						label={t('label.delete_permanently', 'Delete permanently')}
						background="error"
					/>
				</Container>
			</Container>
		</CustomModal>
	</>
);

export default ConfirmDeleteModal;
