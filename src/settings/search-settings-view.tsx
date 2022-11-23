/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Checkbox, Container, FormSubSection } from '@zextras/carbonio-design-system';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AccountSettings, AddMod, PrefsMods } from '../../types';
import { getT } from '../store/i18n';
import { searchPrefsSubSection } from './general-settings-sub-sections';

const SearchSettingsView: FC<{
	settings: AccountSettings;
	addMod: AddMod;
}> = ({ settings, addMod }) => {
	const t = getT();
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
		(prefValue: PrefsMods[keyof PrefsMods], prefKey: keyof PrefsMods) => {
			addMod('prefs', prefKey, prefValue);
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
		setMode(!searchInSpamFolder, 'zimbraPrefIncludeSpamInSearch');
	}, [searchInSpamFolder, setMode]);
	const onClickTrash = useCallback(() => {
		setSearchInTrashFolder(!searchInTrashFolder);
		setMode(!searchInTrashFolder, 'zimbraPrefIncludeTrashInSearch');
	}, [searchInTrashFolder, setMode]);
	const onClickShared = useCallback(() => {
		setSearchInSharedFolder(!searchInSharedFolder);
		setMode(!searchInSharedFolder, 'zimbraPrefIncludeSharedItemsInSearch');
	}, [searchInSharedFolder, setMode]);
	const sectionTitle = useMemo(() => searchPrefsSubSection(t), [t]);
	return (
		<FormSubSection
			label={sectionTitle.label}
			minWidth="calc(min(100%, 32rem))"
			width="50%"
			id={sectionTitle.id}
		>
			<Container crossAlignment="baseline" padding={{ all: 'small' }}>
				<Checkbox
					label={t(
						'settings.search_settings.labels.include_search_in_spam_folder',
						'Include Spam Folder in Searches'
					)}
					value={searchInSpamFolder}
					onClick={onClickSpam}
				/>
				<Checkbox
					label={t(
						'settings.search_settings.labels.include_search_in_trash_folder',
						'Include Trash Folder in Searches'
					)}
					value={searchInTrashFolder}
					onClick={onClickTrash}
				/>
				<Checkbox
					label={t(
						'settings.search_settings.labels.include_search_in_shared_folder',
						'Include Shared Folder in Searches'
					)}
					value={searchInSharedFolder}
					onClick={onClickShared}
				/>
			</Container>
		</FormSubSection>
	);
};

export default SearchSettingsView;
