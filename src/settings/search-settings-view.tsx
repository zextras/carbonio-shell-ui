/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useState, FC, useCallback, useEffect, useMemo } from 'react';
import { Container, FormSubSection, Checkbox } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { AccountSettings } from '../../types';
import { settingsSubSections } from '../constants';

const SearchSettingsView: FC<{
	settings: AccountSettings;
	addMod: (type: 'prefs' | 'props', key: string, value: { value: any; app: string }) => void;
}> = ({ settings, addMod }) => {
	const { t } = useTranslation();
	const [searchInSpamFolder, setSearchInSpamFolder] = useState<boolean>(
		settings.prefs.zimbraPrefIncludeSpamInSearch === 'TRUE'
	);
	const [searchInTrashFolder, setSearchInTrashFolder] = useState<boolean>(
		settings.prefs.zimbraPrefIncludeTrashInSearch === 'TRUE'
	);
	const [searchInSharedFolder, setSearchInSharedFolder] = useState<boolean>(
		settings.prefs.zimbraPrefIncludeSharedItemsInSearch === 'TRUE'
	);
	const setMode = useCallback(
		(v, p) => {
			const value: any = v ? 'TRUE' : 'FALSE';
			addMod('prefs', p, value);
		},
		[addMod]
	);

	useEffect(() => {
		setSearchInSpamFolder(settings.prefs.zimbraPrefIncludeSpamInSearch === 'TRUE');
	}, [settings.prefs.zimbraPrefIncludeSpamInSearch]);
	useEffect(() => {
		setSearchInTrashFolder(settings.prefs.zimbraPrefIncludeTrashInSearch === 'TRUE');
	}, [settings.prefs.zimbraPrefIncludeTrashInSearch]);
	useEffect(() => {
		setSearchInSharedFolder(settings.prefs.zimbraPrefIncludeSharedItemsInSearch === 'TRUE');
	}, [settings.prefs.zimbraPrefIncludeSharedItemsInSearch]);

	const onClickSpam = useCallback(() => {
		setSearchInSpamFolder(!searchInSpamFolder);
		setMode(!searchInSpamFolder, 'zimbraPrefIncludeSpamItemsInSearch');
	}, [searchInSpamFolder, setMode]);
	const onClickTrash = useCallback(() => {
		setSearchInTrashFolder(!searchInTrashFolder);
		setMode(!searchInTrashFolder, 'zimbraPrefIncludeTrashInSearch');
	}, [searchInTrashFolder, setMode]);
	const onClickShared = useCallback(() => {
		setSearchInSharedFolder(!searchInSharedFolder);
		setMode(!searchInSharedFolder, 'zimbraPrefIncludeSharedItemsInSearch');
	}, [searchInSharedFolder, setMode]);
	const sectionTitle = useMemo(
		() => t(settingsSubSections[3].label, settingsSubSections[3].fallback),
		[t]
	);
	return (
		<FormSubSection
			label={sectionTitle}
			minWidth="calc(min(100%, 512px))"
			width="50%"
			id={sectionTitle.replace(/\s/g, '')}
		>
			<Container crossAlignment="baseline" padding={{ all: 'small' }}>
				<Checkbox
					label={t(
						'settings.search_settings.labels.include_search_in_spam_folder',
						'Include Spam Folder in Searches'
					)}
					value={searchInSpamFolder}
					onClick={(): void => onClickSpam()}
				/>
				<Checkbox
					label={t(
						'settings.search_settings.labels.include_search_in_trash_folder',
						'Include Trash Folder in Searches'
					)}
					value={searchInTrashFolder}
					onClick={(): void => onClickTrash()}
				/>
				<Checkbox
					label={t(
						'settings.search_settings.labels.include_search_in_shared_folder',
						'Include Shared Folder in Searches'
					)}
					value={searchInSharedFolder}
					onClick={(): void => onClickShared()}
				/>
			</Container>
		</FormSubSection>
	);
};

export default SearchSettingsView;
