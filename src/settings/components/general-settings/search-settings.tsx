/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Checkbox, Container, FormSubSection } from '@zextras/carbonio-design-system';

import { AccountSettings, AddMod } from '../../../../types';
import { getT } from '../../../store/i18n';
import { searchPrefsSubSection } from '../../general-settings-sub-sections';
import { useReset } from '../../hooks/use-reset';
import { SettingsSectionProps, upsertPrefOnUnsavedChanges } from '../utils';

type SearchSettingsViewProps = SettingsSectionProps & {
	settings: AccountSettings;
	addMod: AddMod;
};

export const SearchSettings = ({
	settings,
	addMod,
	resetRef
}: SearchSettingsViewProps): JSX.Element => {
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
	const setMode = useMemo(() => upsertPrefOnUnsavedChanges(addMod), [addMod]);

	const init = useCallback(() => {
		setSearchInSpamFolder(settings.prefs.zimbraPrefIncludeSpamInSearch === 'TRUE');
		setSearchInTrashFolder(settings.prefs.zimbraPrefIncludeTrashInSearch === 'TRUE');
		setSearchInSharedFolder(settings.prefs.zimbraPrefIncludeSharedItemsInSearch === 'TRUE');
	}, [
		settings.prefs.zimbraPrefIncludeSharedItemsInSearch,
		settings.prefs.zimbraPrefIncludeSpamInSearch,
		settings.prefs.zimbraPrefIncludeTrashInSearch
	]);

	useReset(resetRef, init);

	useEffect(() => {
		init();
	}, [init]);

	const onClickSpam = useCallback(() => {
		setSearchInSpamFolder((prevState) => {
			const newValue = !prevState;
			setMode('zimbraPrefIncludeSpamInSearch', newValue);
			return newValue;
		});
	}, [setMode]);

	const onClickTrash = useCallback(() => {
		setSearchInTrashFolder((prevState) => {
			const newValue = !prevState;
			setMode('zimbraPrefIncludeTrashInSearch', newValue);
			return newValue;
		});
	}, [setMode]);

	const onClickShared = useCallback(() => {
		setSearchInSharedFolder((prevState) => {
			const newValue = !prevState;
			setMode('zimbraPrefIncludeSharedItemsInSearch', newValue);
			return newValue;
		});
	}, [setMode]);

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
