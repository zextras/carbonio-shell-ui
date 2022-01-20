/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useState, FC, useEffect, useCallback } from 'react';
import { Container, FormSubSection, Checkbox } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { AccountSettings } from '../../types';

const SearchSettingsView: FC<{
	settings: AccountSettings;
	addMod: (type: 'prefs' | 'props', key: string, value: { value: any; app: string }) => void;
}> = ({ settings, addMod }) => {
	const { t } = useTranslation();
	const [searchInSpamFolder, setSearchInSpamFolder] = useState<boolean>(
		settings.prefs.zimbraPrefIncludeSpamInSearch === 'TRUE'
	);
	const [searchInSharedFolder, setSearchInSharedFolder] = useState<boolean>(
		settings.prefs.zimbraPrefIncludeSharedItemsInSearch === 'TRUE'
	);
	const [searchInTrashFolder, setSearchInTrashFolder] = useState<boolean>(
		settings.prefs.zimbraPrefIncludeTrashInSearch === 'TRUE'
	);

	const setMode = useCallback(
		(v, p) => {
			const value: any = v ? 'TRUE' : 'FALSE';
			addMod('prefs', p, value);
		},
		[addMod]
	);

	useEffect(() => {
		setMode(searchInSpamFolder, 'zimbraPrefIncludeSpamInSearch');
		setMode(searchInTrashFolder, 'zimbraPrefIncludeTrashInSearch');
		setMode(searchInSharedFolder, 'zimbraPrefIncludeSharedItemsInSearch');
	}, [searchInSpamFolder, searchInTrashFolder, searchInSharedFolder, setMode]);

	return (
		<FormSubSection label={t('search.app', 'Search')} minWidth="calc(min(100%, 512px))" width="50%">
			<Container crossAlignment="baseline" padding={{ all: 'small' }}>
				<Checkbox
					label={t(
						'settings.search_settings.labels.include_search_in_spam_folder',
						'Include Spam Folder in Searches'
					)}
					defaultChecked={searchInSpamFolder}
					onChange={(e: boolean): void => {
						setSearchInSpamFolder(e);
					}}
				/>
				<Checkbox
					label={t(
						'settings.search_settings.labels.include_search_in_trash_folder',
						'Include Trash Folder in Searches'
					)}
					defaultChecked={searchInTrashFolder}
					onChange={(e: boolean): void => {
						setSearchInTrashFolder(e);
					}}
				/>
				<Checkbox
					label={t(
						'settings.search_settings.labels.include_search_in_shared_folder',
						'Include Shared Folder in Searches'
					)}
					defaultChecked={searchInSharedFolder}
					onChange={(e: boolean): void => {
						setSearchInSharedFolder(e);
					}}
				/>
			</Container>
		</FormSubSection>
	);
};

export default SearchSettingsView;
