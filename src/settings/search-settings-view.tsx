/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Checkbox, Container, FormSubSection } from '@zextras/carbonio-design-system';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AccountSettings, AddMod, BooleanString, PrefsMods } from '../../types';
import { getT } from '../store/i18n';
import { searchPrefsSubSection } from './general-settings-sub-sections';

type SearchSettingsViewProps = {
	settings: AccountSettings;
	addMod: AddMod;
};

export const SearchSettingsView = ({ settings, addMod }: SearchSettingsViewProps): JSX.Element => {
	const t = getT();
	const [searchInSpamFolder, setSearchInSpamFolder] = useState<BooleanString>(
		settings.prefs.zimbraPrefIncludeSpamInSearch ?? 'FALSE'
	);
	const [searchInTrashFolder, setSearchInTrashFolder] = useState<BooleanString>(
		settings.prefs.zimbraPrefIncludeTrashInSearch ?? 'FALSE'
	);
	const [searchInSharedFolder, setSearchInSharedFolder] = useState<BooleanString>(
		settings.prefs.zimbraPrefIncludeSharedItemsInSearch ?? 'FALSE'
	);
	const setMode = useCallback(
		<K extends keyof PrefsMods>(prefKey: K, prefValue: PrefsMods[K]) => {
			addMod('prefs', prefKey, prefValue);
		},
		[addMod]
	);

	useEffect(() => {
		setSearchInSpamFolder(settings.prefs.zimbraPrefIncludeSpamInSearch ?? 'FALSE');
	}, [settings.prefs.zimbraPrefIncludeSpamInSearch]);

	useEffect(() => {
		setSearchInTrashFolder(settings.prefs.zimbraPrefIncludeTrashInSearch ?? 'FALSE');
	}, [settings.prefs.zimbraPrefIncludeTrashInSearch]);

	useEffect(() => {
		setSearchInSharedFolder(settings.prefs.zimbraPrefIncludeSharedItemsInSearch ?? 'FALSE');
	}, [settings.prefs.zimbraPrefIncludeSharedItemsInSearch]);

	const onClickSpam = useCallback(() => {
		setSearchInSpamFolder((prevState) => {
			const newValue = prevState === 'TRUE' ? 'FALSE' : 'TRUE';
			setMode('zimbraPrefIncludeSpamInSearch', newValue);
			return newValue;
		});
	}, [setMode]);

	const onClickTrash = useCallback(() => {
		setSearchInTrashFolder((prevState) => {
			const newValue = prevState === 'TRUE' ? 'FALSE' : 'TRUE';
			setMode('zimbraPrefIncludeTrashInSearch', newValue);
			return newValue;
		});
	}, [setMode]);

	const onClickShared = useCallback(() => {
		setSearchInSharedFolder((prevState) => {
			const newValue = prevState === 'TRUE' ? 'FALSE' : 'TRUE';
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
					value={searchInSpamFolder === 'TRUE'}
					onClick={onClickSpam}
				/>
				<Checkbox
					label={t(
						'settings.search_settings.labels.include_search_in_trash_folder',
						'Include Trash Folder in Searches'
					)}
					value={searchInTrashFolder === 'TRUE'}
					onClick={onClickTrash}
				/>
				<Checkbox
					label={t(
						'settings.search_settings.labels.include_search_in_shared_folder',
						'Include Shared Folder in Searches'
					)}
					value={searchInSharedFolder === 'TRUE'}
					onClick={onClickShared}
				/>
			</Container>
		</FormSubSection>
	);
};
