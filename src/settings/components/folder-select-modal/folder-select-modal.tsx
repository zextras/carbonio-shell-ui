/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// this component is work in progress for when the mails sync is implemented

// import React, { FC, ReactElement, useCallback, useMemo, useState } from 'react';
// import { Container, CustomModal, Input, Text, Icon } from '@zextras/carbonio-design-system';
// import { TFunction } from 'i18next';
// import { filter, isEmpty, reduce, startsWith } from 'lodash';
// import ModalFooter from './modal-footer';
// import ModalHeader from './modal-header';
// import FolderItem from './folder-item';
// import { ZIMBRA_STANDARD_COLORS, FOLDERS } from '../../../constants';
// import { useRefresh } from '../../../store/account/hooks';
// import { Folder as FolderType } from '../../../../types';

// export const getFolderIconColor = (f: { color: number; uiRgb: number }): number =>
// 	f.color < 10 ? ZIMBRA_STANDARD_COLORS[f.color].uiRgb : f?.rgb ?? ZIMBRA_STANDARD_COLORS[0].uiRgb;

// export const getFolderIconName = (folder: { id: string }): string => {
// 	if (systemFolders.includes(folder.id)) {
// 		switch (folder.id) {
// 			case FOLDERS.INBOX:
// 				return 'InboxOutline';
// 			case FOLDERS.DRAFTS:
// 				return 'FileOutline';
// 			case FOLDERS.SENT:
// 				return 'PaperPlaneOutline';
// 			case FOLDERS.SPAM:
// 				return 'SlashOutline';
// 			case FOLDERS.TRASH:
// 				return 'Trash2Outline';
// 			case 'share':
// 				return 'ShareOutline';
// 			default:
// 				return 'FolderOutline';
// 		}
// 	}
// 	if (folder.isSharedFolder) {
// 		return 'ShareOutline';
// 	}
// 	return 'FolderOutline';
// };

// type ComponentProps = {
// 	compProps: { open: boolean; onClose: () => void; setFolder: (arg: any) => void; t: TFunction };
// };

// const FolderSelectModal: FC<ComponentProps> = ({ compProps }): ReactElement => {
// 	const { open, onClose, setFolder, t } = compProps;
// 	const folders = useRefresh();
// 	const [input, setInput] = useState('');
// 	const [folderDestination, setFolderDestination] = useState<FolderType | any>({});

// 	const filterFromInput = useMemo(
// 		() =>
// 			filter(folders, (v) => {
// 				if (isEmpty(v)) {
// 					return false;
// 				}

// 				return startsWith(v?.name?.toLowerCase(), input.toLowerCase());
// 			}),
// 		[folders, input]
// 	);

// 	const nestFilteredFolders: any = useCallback(
// 		(items: Array<FolderType>, id: string, results: Array<FolderType>, getSharedFolder: boolean) =>
// 			reduce(
// 				filter(items, (item) =>
// 					getSharedFolder
// 						? item.parent === id && item.isSharedFolder
// 						: item.parent === id && item.id !== '4' && item.id !== '3' && !item.isSharedFolder
// 				),
// 				(acc: Array<FolderType>, item: any) => {
// 					const match = filter(results, (result) => result.id === item.id);
// 					if (match && match.length) {
// 						return [
// 							...acc,
// 							{
// 								...item,
// 								label: item.name,
// 								icon: getFolderIconName(item),
// 								iconCustomColor: getFolderIconColor(item),
// 								items: nestFilteredFolders(items, item.id, results, getSharedFolder),
// 								onClick: (): void => setFolderDestination(item),
// 								open: !!input.length,
// 								divider: true,
// 								background: folderDestination.id === item.id ? 'highlight' : undefined
// 							}
// 						];
// 					}
// 					if (match && !match.length) {
// 						return [...acc, ...nestFilteredFolders(items, item.id, results)];
// 					}
// 					return acc;
// 				},
// 				[]
// 			),
// 		[folderDestination.id, input.length]
// 	);

// 	const shareFolders = useMemo(
// 		() => [
// 			{
// 				id: '1',
// 				label: 'Shared Folders',
// 				level: '0',
// 				icon: 'Share',
// 				divider: true,
// 				items: nestFilteredFolders(folders, '1', filterFromInput, true),
// 				background: folderDestination.id === '1' ? 'highlight' : undefined,
// 				onClick: (): void => setFolderDestination({ id: '1' })
// 			}
// 		],
// 		[filterFromInput, folderDestination.id, folders, nestFilteredFolders]
// 	);
// 	const nestedData = useMemo(
// 		() => nestFilteredFolders(folders, '1', filterFromInput, false),
// 		[nestFilteredFolders, folders, filterFromInput]
// 	);
// 	const requiredData = useMemo(() => nestedData.concat(shareFolders), [nestedData, shareFolders]);
// 	const onConfirm = useCallback(() => {
// 		setFolder([
// 			{
// 				label: `in:${folderDestination.name}`,
// 				hasAvatar: true,
// 				isGeneric: false,
// 				background: 'gray2',
// 				avatarBackground: getFolderIconColor(folderDestination),
// 				avatarIcon: 'FolderOutline',
// 				isQueryFilter: true,
// 				value: `in:"${folderDestination.name}"`
// 			}
// 		]);
// 		onClose();
// 	}, [setFolder, folderDestination, onClose]);

// 	const disabled = useMemo(() => isEmpty(folderDestination), [folderDestination]);
// 	return (
// 		<CustomModal open={open} onClose={onClose} maxHeight="90vh" size="medium">
// 			<Container
// 				padding={{ all: 'large' }}
// 				mainAlignment="center"
// 				crossAlignment="flex-start"
// 				height="fit"
// 			>
// 				<ModalHeader title={t('label', 'default')} onClose={onClose} />
// 				<Container mainAlignment="center" crossAlignment="flex-start">
// 					<Container
// 						padding={{ all: 'small' }}
// 						mainAlignment="center"
// 						crossAlignment="flex-start"
// 						height="fit"
// 					>
// 						<Container
// 							padding={{ all: 'small' }}
// 							mainAlignment="center"
// 							crossAlignment="flex-start"
// 						>
// 							<Text overflow="break-word">
// 								{t(
// 									'label',
// 									'default'
// 								)}
// 							</Text>
// 						</Container>
// 						<Input
// 							inputName="test"
// 							label={t('label', 'default')}
// 							backgroundColor="gray5"
// 							value={input}
// 							CustomIcon={({ hasFocus }: { hasFocus: boolean }): ReactElement => (
// 								<Icon icon="FunnelOutline" size="large" color={hasFocus ? 'primary' : 'text'} />
// 							)}
// 							onChange={(e: any): void => setInput(e.target.value)}
// 						/>

// 						<FolderItem folders={requiredData} />
// 					</Container>
// 					<ModalFooter
// 						onConfirm={onConfirm}
// 						secondaryAction={onClose}
// 						label={t('label.choose_folder', 'Choose folder')}
// 						secondaryLabel={t('label.go_back', 'Go Back')}
// 						disabled={disabled}
// 					/>
// 				</Container>
// 			</Container>
// 		</CustomModal>
// 	);
// };

// export default FolderSelectModal;
