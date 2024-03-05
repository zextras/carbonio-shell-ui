/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';

import { Container, useSnackbar } from '@zextras/carbonio-design-system';
import { findIndex, includes, isEmpty, map, reduce, size } from 'lodash';

import AppearanceSettings from './components/general-settings/appearance-settings';
import DarkThemeSettingSection from './components/general-settings/dark-theme-settings-section';
import { Logout } from './components/general-settings/logout';
import ModuleVersionSettings from './components/general-settings/module-version-settings';
import { OutOfOfficeSettings } from './components/general-settings/out-of-office-settings';
import { ScalingSettingSection } from './components/general-settings/scaling-setting-section';
import { SearchSettings } from './components/general-settings/search-settings';
import UserQuota from './components/general-settings/user-quota';
import { SettingsHeader, SettingsHeaderProps } from './components/settings-header';
import { ResetComponentImperativeHandler } from './components/utils';
import { LanguageAndTimeZoneSettings } from './language-and-timezone-settings';
import {
	AccountState,
	AddMod,
	BatchRequest,
	ModifyPrefsRequest,
	ModifyPrefsResponse,
	ModifyPropertiesRequest,
	ModifyPropertiesResponse,
	Mods,
	RemoveMod
} from '../../types';
import { ScalingSettings } from '../../types/settings';
import { LOCAL_STORAGE_SETTINGS_KEY, SHELL_APP_ID } from '../constants';
import { getSoapFetch } from '../network/fetch';
import { useLocalStorage } from '../shell/hooks/useLocalStorage';
import { useAccountStore, useUserSettings } from '../store/account';
import { getT } from '../store/i18n';

const GeneralSettings = (): React.JSX.Element => {
	const [mods, setMods] = useState<Mods>({});
	const t = getT();
	const userSettings = useUserSettings();
	const [localStorageUnAppliedChanges, setLocalStorageUnAppliedChanges] = useState<ScalingSettings>(
		{}
	);
	const [localStorageSettings, setLocalStorageSettings] = useLocalStorage<ScalingSettings>(
		LOCAL_STORAGE_SETTINGS_KEY,
		{}
	);
	const [open, setOpen] = useState(false);

	const addLocalStoreChange = useCallback((key, value) => {
		setLocalStorageUnAppliedChanges((prevState) => ({
			...prevState,
			[key]: value
		}));
	}, []);

	const cleanLocalStoreChange = useCallback<(key: keyof ScalingSettings) => void>((key) => {
		setLocalStorageUnAppliedChanges((prevState) => {
			const nextState = { ...prevState };
			delete nextState[key];
			return nextState;
		});
	}, []);

	const addMod = useCallback<AddMod>((type, key, value) => {
		setMods((prevState) => ({
			...prevState,
			[type]: {
				...prevState?.[type],
				[key]: value
			}
		}));
	}, []);

	const removeMod = useCallback<RemoveMod>((type, key) => {
		setMods((prevState) => {
			const prevType = prevState[type];
			if (prevType && prevType[key] !== undefined) {
				const nextState = { ...prevState, [type]: { ...prevState[type] } };
				const nextType = nextState[type];
				if (nextType && nextType[key] !== undefined) {
					delete nextType[key];
				}
				if (size(nextState[type]) === 0) {
					delete nextState[type];
				}
				return nextState;
			}
			return prevState;
		});
	}, []);
	const createSnackbar = useSnackbar();

	const onSave = useCallback<SettingsHeaderProps['onSave']>(() => {
		setLocalStorageUnAppliedChanges((unAppliedPrevState) => {
			if (size(unAppliedPrevState) > 0) {
				setLocalStorageSettings((localStorageSettingsPrevState) => ({
					...localStorageSettingsPrevState,
					...unAppliedPrevState
				}));
				return {};
			}
			return unAppliedPrevState;
		});
		if (size(mods) > 0) {
			let modifyPropertiesRequest: ModifyPropertiesRequest | undefined;
			if (mods.props) {
				const mappedProperties = map(
					mods.props,
					(prop, key): ModifyPropertiesRequest['prop'][0] => ({
						name: key,
						zimlet: prop.app,
						_content: prop.value
					})
				);
				modifyPropertiesRequest = { _jsns: 'urn:zimbraAccount', prop: mappedProperties };
			}

			let modifyPrefsRequest: ModifyPrefsRequest | undefined;

			if (mods.prefs) {
				const attrs = mods.prefs;
				if ('zimbraPrefMailTrustedSenderList' in attrs) {
					attrs.zimbraPrefMailTrustedSenderList =
						attrs.zimbraPrefMailTrustedSenderList instanceof Array &&
						attrs.zimbraPrefMailTrustedSenderList.length === 0
							? ''
							: attrs.zimbraPrefMailTrustedSenderList;
				}
				modifyPrefsRequest = { _jsns: 'urn:zimbraAccount', _attrs: attrs };
			}

			const promise = getSoapFetch(SHELL_APP_ID)<
				BatchRequest,
				{
					ModifyPropertiesResponse?: ModifyPropertiesResponse;
					ModifyPrefsResponse?: ModifyPrefsResponse;
				}
			>('Batch', {
				_jsns: 'urn:zimbra',
				ModifyPropertiesRequest: modifyPropertiesRequest,
				ModifyPrefsRequest: modifyPrefsRequest
			})
				.then(() => {
					useAccountStore.setState((s: AccountState) => ({
						settings: {
							...s.settings,
							prefs: reduce(
								mods.prefs,
								(acc, pref, key) => ({
									...acc,
									[key]: pref as string
								}),
								s.settings.prefs
							),
							props: reduce(
								mods.props,
								(acc, { app, value }, key) => {
									const propIndex = findIndex(acc, (p) => p.name === key && p.zimlet === app);
									if (propIndex >= 0) {
										// eslint-disable-next-line no-param-reassign
										acc[propIndex] = {
											name: key,
											zimlet: app,
											_content: value as string
										};
									} else {
										acc.push({
											name: key,
											zimlet: app,
											_content: value as string
										});
									}
									return acc;
								},
								s.settings.props
							)
						}
					}));

					if (mods.prefs && includes(Object.keys(mods.prefs), 'zimbraPrefLocale')) {
						setOpen(true);
					}
					createSnackbar({
						key: `new`,
						replace: true,
						type: 'info',
						label: t('message.snackbar.settings_saved', 'Edits saved correctly'),
						autoHideTimeout: 3000,
						hideButton: true
					});
					setMods({});
				})
				.catch((error: unknown) => {
					createSnackbar({
						key: `new`,
						replace: true,
						type: 'error',
						label: t('snackbar.error', 'Something went wrong, please try again'),
						autoHideTimeout: 3000,
						hideButton: true
					});
					if (error instanceof Error) {
						throw error;
					}
					throw new Error(typeof error === 'string' ? error : 'edit setting error');
				});
			return Promise.allSettled([promise]);
		}
		return Promise.allSettled([Promise.resolve()]);
	}, [mods, setLocalStorageSettings, createSnackbar, t]);

	const scalingSettingSectionRef = useRef<ResetComponentImperativeHandler>(null);
	const darkThemeSettingSectionRef = useRef<ResetComponentImperativeHandler>(null);
	const languageAndTimeZoneSettingsSectionRef = useRef<ResetComponentImperativeHandler>(null);
	const outOfOfficeSettingsSectionRef = useRef<ResetComponentImperativeHandler>(null);
	const searchSettingsSectionRef = useRef<ResetComponentImperativeHandler>(null);

	const onCancel = useCallback(() => {
		setMods({});
		if (size(localStorageUnAppliedChanges) > 0) {
			scalingSettingSectionRef.current?.reset();
		}
		darkThemeSettingSectionRef.current?.reset();
		languageAndTimeZoneSettingsSectionRef.current?.reset();
		outOfOfficeSettingsSectionRef.current?.reset();
		searchSettingsSectionRef?.current?.reset();
	}, [localStorageUnAppliedChanges]);

	const isDirty = useMemo(
		() => !isEmpty(mods) || !isEmpty(localStorageUnAppliedChanges),
		[mods, localStorageUnAppliedChanges]
	);

	const title = useMemo(() => t('settings.general.general', 'General Settings'), [t]);

	return (
		<>
			<SettingsHeader title={title} onCancel={onCancel} onSave={onSave} isDirty={isDirty} />
			<Container
				background={'gray5'}
				mainAlignment="flex-start"
				crossAlignment={'flex-start'}
				gap="0.5rem"
				padding={{ all: 'medium' }}
				style={{ overflow: 'auto' }}
			>
				<AppearanceSettings>
					<ScalingSettingSection
						resetRef={scalingSettingSectionRef}
						scalingSettings={localStorageSettings}
						addLocalStoreChange={addLocalStoreChange}
						cleanLocalStoreChange={cleanLocalStoreChange}
					/>
					<DarkThemeSettingSection
						resetRef={darkThemeSettingSectionRef}
						addMod={addMod}
						removeMod={removeMod}
					/>
				</AppearanceSettings>
				<LanguageAndTimeZoneSettings
					settings={userSettings}
					addMod={addMod}
					open={open}
					setOpen={setOpen}
					resetRef={languageAndTimeZoneSettingsSectionRef}
				/>

				<OutOfOfficeSettings
					settings={userSettings}
					addMod={addMod}
					resetRef={outOfOfficeSettingsSectionRef}
				/>
				<SearchSettings
					settings={userSettings}
					addMod={addMod}
					resetRef={searchSettingsSectionRef}
				/>
				<ModuleVersionSettings />
				<UserQuota mobileView={false} />
				<Logout />
			</Container>
		</>
	);
};

export default GeneralSettings;
