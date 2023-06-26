/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo, useState, useEffect, ReactElement } from 'react';
import { Container, useSnackbar } from '@zextras/carbonio-design-system';
import type { TFunction } from 'i18next';
import {
	map,
	find,
	replace,
	lowerFirst,
	isEmpty,
	uniq,
	isArray,
	reduce,
	findIndex,
	filter,
	size
} from 'lodash';
import { useAccountStore, useUserSettings } from '../store/account';
import type { Account, AccountSettings, ModifyIdentityRequest, IdentityProps } from '../../types';
import AccountsList from './components/account-settings/accounts-list';
import PrimaryAccountSettings from './components/account-settings/primary-account-settings';
import SettingsSentMessages from './components/account-settings/settings-sent-messages';
import Delegates from './components/account-settings/delegates';
import PersonaSettings from './components/account-settings/persona-settings';
import {
	BatchRequest,
	CreateIdentityResponse,
	DeleteIdentityResponse,
	ModifyIdentityResponse,
	CreateIdentityRequest,
	DeleteIdentityRequest,
	AccountState,
	IdentityAttrs
} from '../../types';
import { getSoapFetch } from '../network/fetch';
import { SHELL_APP_ID } from '../constants';
import SettingsHeader, { SettingsHeaderProps } from './components/settings-header';

type AccountSettingsProps = {
	account: Account;
	identitiesDefault: IdentityProps[];
	t: TFunction;
};

/**
 * Compose a unique list of all identities' email addresses
 *
 * The list is composed of:
 * - the email address of the current account
 * - the email addresses of all the shared accounts (taken from the rights infos)
 * - all the aliases
 *
 * @param account
 * @param settings
 *
 * @returns a list of unique email addresses
 */
const getAvailableEmailAddresses = (account: Account, settings: AccountSettings): string[] => {
	const result: string[] = [];

	// Adds the email address of the primary account
	result.push(account.name);

	// Adds the email addresses of all the shared accounts
	if (account.rights?.targets) {
		account.rights?.targets.forEach((target) => {
			if (target.target && (target.right === 'sendAs' || target.right === 'sendOnBehalfOf')) {
				target.target.forEach((user) => {
					if (user.type === 'account' && user.email) {
						user.email.forEach((email) => {
							result.push(email.addr);
						});
					}
				});
			}
		});
	}

	// Adds all the aliases
	if (settings.attrs.zimbraMailAlias) {
		if (isArray(settings.attrs.zimbraMailAlias)) {
			result.push(...(settings.attrs.zimbraMailAlias as string[]));
		} else {
			result.push(String(settings.attrs.zimbraMailAlias));
		}
	}

	return uniq(result);
};

type IdentityAttrsRecord<T extends string | number> = Record<T, Partial<IdentityAttrs>>;

export const AccountsSettings = ({
	account,
	identitiesDefault,
	t
}: AccountSettingsProps): ReactElement => {
	const [createList, setCreateList] = useState<NonNullable<IdentityAttrsRecord<number>>>({});
	const [deleteList, setDeleteList] = useState<Array<string>>([]);
	const [modifyList, setModifyList] = useState<NonNullable<IdentityAttrsRecord<string>>>({});

	const resetLists = useCallback(() => {
		setCreateList({});
		setDeleteList([]);
		setModifyList({});
	}, []);

	const [selectedIdentityId, setSelectedIdentityId] = useState(0);
	const [identities, setIdentities] = useState<IdentityProps[]>(identitiesDefault);
	const settings = useUserSettings();
	const maxIdentities = settings.attrs.zimbraIdentityMaxNumEntries;

	const onCancel = useCallback(() => {
		resetLists();
		setIdentities(identitiesDefault);
		setSelectedIdentityId(size(identitiesDefault) - 1);
	}, [identitiesDefault, resetLists]);

	const updateModifyList = useCallback<
		<K extends keyof IdentityAttrs>(id: string, key: K, value: IdentityAttrs[K]) => void
	>(
		(id, key, value) => {
			setModifyList((prevState) => {
				const updatedIdentityKey = lowerFirst(
					replace(key, 'zimbraPref', '')
				) as keyof IdentityProps;

				const prevRecordPrefs = prevState[id] || {};
				const actualIdentity = find(identitiesDefault, (item) => item.identityId === id);

				const newModifyList = {
					...prevState,
					[id]: {
						...prevRecordPrefs,
						[key]: value
					}
				};

				if (actualIdentity && actualIdentity[updatedIdentityKey] === value) {
					delete newModifyList[id][key];
				}
				if (size(newModifyList[id]) === 0) {
					delete newModifyList[id];
				}
				return newModifyList;
			});
		},
		[identitiesDefault]
	);

	const modifyCreateList = useCallback<
		<K extends keyof IdentityAttrs>(id: number, key: K, value: IdentityAttrs[K]) => void
	>((id, key, value) => {
		setCreateList((prevState) => {
			const newCreateList = { ...prevState };
			newCreateList[id][key] = value;
			return newCreateList;
		});
	}, []);
	const addIdentity = useCallback<(id: number, identityAttrs: IdentityAttrs) => void>(
		(id, identityAttrs) => {
			setCreateList((prevState) => ({ ...prevState, [id]: identityAttrs }));
		},
		[]
	);

	const updateIdentities = useCallback<
		<K extends keyof IdentityAttrs>(id: string | number, key: K, value: IdentityAttrs[K]) => void
	>(
		(id, key, value) => {
			if (typeof id === 'string') {
				updateModifyList(id, key, value);
			} else {
				modifyCreateList(id, key, value);
			}
			const updatedIdentityKey = lowerFirst(replace(key, 'zimbraPref', ''));
			setIdentities((prevState) =>
				map(prevState, (item) =>
					item.identityId === id ? { ...item, [updatedIdentityKey]: value } : item
				)
			);
		},
		[updateModifyList, modifyCreateList]
	);

	const removeIdentity = useCallback((identityId: string | number) => {
		if (typeof identityId === 'string') {
			setDeleteList((prevState) => [...prevState, identityId]);
			setModifyList((prevState) => {
				if (prevState[identityId]) {
					const newModifyList = { ...prevState };
					delete newModifyList[identityId];
					return newModifyList;
				}
				return prevState;
			});
		} else {
			setCreateList((prevState) => {
				if (prevState[identityId]) {
					const newCreateList = { ...prevState };
					delete newCreateList[identityId];
					return newCreateList;
				}
				return prevState;
			});
		}
	}, []);

	const createSnackbar = useSnackbar();

	useEffect(() => {
		setIdentities(identitiesDefault);
		resetLists();
	}, [identitiesDefault, resetLists]);

	const onSave = useCallback<SettingsHeaderProps['onSave']>(() => {
		if (
			maxIdentities !== undefined &&
			identitiesDefault.length + (size(createList) || 0) - (deleteList?.length || 0) > maxIdentities
		) {
			createSnackbar({
				key: `new`,
				replace: true,
				type: 'error',
				label: t(
					'message.snackbar.identities_quota_exceeded',
					'The identity could not be created because you have exceeded your identity quota'
				),
				autoHideTimeout: 5000,
				hideButton: true
			});
			return Promise.allSettled([
				Promise.reject(
					new Error(
						'The identity could not be created because you have exceeded your identity quota'
					)
				)
			]);
		}

		let createIdentityRequests: Array<CreateIdentityRequest> = [];
		if (createList) {
			createIdentityRequests = map(
				createList,
				(item): CreateIdentityRequest => ({
					_jsns: 'urn:zimbraAccount',
					identity: {
						name: item.zimbraPrefIdentityName,
						_attrs: {
							...item,
							zimbraPrefFromAddressType: item.zimbraPrefFromAddressType || 'sendAs'
						}
					}
				})
			);
		}
		let deleteRequests: Array<DeleteIdentityRequest> = [];
		if (deleteList) {
			deleteRequests = map(
				deleteList,
				(identityId, index): DeleteIdentityRequest => ({
					_jsns: 'urn:zimbraAccount',
					identity: { id: identityId },
					requestId: index.toString()
				})
			);
		}

		let modifyIdentityRequests: Array<ModifyIdentityRequest> = [];
		if (modifyList) {
			modifyIdentityRequests = map(
				modifyList,
				(item, index): ModifyIdentityRequest => ({
					_jsns: 'urn:zimbraAccount',
					identity: {
						id: index,
						_attrs: item
					}
				})
			);
		}

		const promise = getSoapFetch(SHELL_APP_ID)<
			BatchRequest,
			{
				ModifyIdentityResponse?: ModifyIdentityResponse[];
				DeleteIdentityResponse?: DeleteIdentityResponse[];
				CreateIdentityResponse?: CreateIdentityResponse[];
			}
		>('Batch', {
			_jsns: 'urn:zimbra',
			DeleteIdentityRequest: deleteRequests.length > 0 ? deleteRequests : undefined,
			CreateIdentityRequest: createIdentityRequests.length > 0 ? createIdentityRequests : undefined,
			ModifyIdentityRequest: modifyIdentityRequests.length > 0 ? modifyIdentityRequests : undefined
		})
			.then((res) => {
				useAccountStore.setState((s: AccountState) => {
					let newIdentity;
					if (typeof s.account !== 'undefined') {
						const filteredIdentities = filter(
							s.account.identities.identity,
							(item) => !deleteList?.includes(item.id)
						);
						filteredIdentities.splice(
							-1,
							0,
							...map(res?.CreateIdentityResponse, (item) => item.identity[0])
						);
						newIdentity = reduce(
							modifyList,
							(acc, prefs, id) => {
								const propIndex = findIndex(
									acc,
									(itemMods, indexAccount) => acc[indexAccount].id === id
								);
								if (propIndex > -1) {
									// eslint-disable-next-line no-param-reassign
									acc[propIndex]._attrs = {
										...acc[propIndex]._attrs,
										...prefs
									};
									if (prefs.zimbraPrefIdentityName && acc[propIndex].name !== 'DEFAULT') {
										// eslint-disable-next-line no-param-reassign
										acc[propIndex].name = prefs.zimbraPrefIdentityName;
									}
								}
								return acc;
							},
							filteredIdentities
						);
					}
					return {
						...s,
						account: {
							...s.account,
							displayName:
								find(modifyList, (item) => item.zimbraPrefIdentityId === s?.account?.id)
									?.zimbraPrefIdentityName || s.account?.displayName,
							identities: {
								identity: newIdentity
							}
						} as Account
					};
				});
				resetLists();
				createSnackbar({
					key: `new`,
					replace: true,
					type: 'info',
					label: t('message.snackbar.settings_saved', 'Edits saved correctly'),
					autoHideTimeout: 3000,
					hideButton: true
				});
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
	}, [
		identitiesDefault.length,
		createList,
		deleteList,
		maxIdentities,
		modifyList,
		resetLists,
		createSnackbar,
		t
	]);

	const title: string = t('label.accounts', 'Accounts');
	const isDirty = useMemo(
		() => !isEmpty(createList) || !isEmpty(deleteList) || !isEmpty(modifyList),
		[createList, deleteList, modifyList]
	);
	const availableEmailAddresses = useMemo(
		() => getAvailableEmailAddresses(account, settings),
		[account, settings]
	);
	return (
		<>
			<SettingsHeader onSave={onSave} onCancel={onCancel} isDirty={isDirty} title={title} />
			<Container background="gray5" padding={{ top: 'large' }} height="fit" />
			<Container
				background="gray5"
				mainAlignment="flex-start"
				padding={{ all: 'large' }}
				style={{ overflow: 'auto' }}
			>
				<AccountsList
					t={t}
					accountName={account.name}
					identities={identities}
					setIdentities={setIdentities}
					selectedIdentityId={selectedIdentityId}
					setSelectedIdentityId={setSelectedIdentityId}
					removeIdentity={removeIdentity}
					addIdentity={addIdentity}
				/>
				{identities[selectedIdentityId]?.flgType === 'primary' && (
					<>
						<PrimaryAccountSettings
							t={t}
							account={account}
							identity={identities[0]}
							updateIdentities={updateIdentities}
						/>
						<SettingsSentMessages
							t={t}
							identity={identities[selectedIdentityId]}
							isExternalAccount={false}
							updateIdentities={updateIdentities}
							availableEmailAddresses={availableEmailAddresses}
						/>
						<Delegates />
					</>
				)}
				{identities[selectedIdentityId]?.flgType === 'persona' && (
					<>
						<PersonaSettings
							t={t}
							items={identities[selectedIdentityId]}
							updateIdentities={updateIdentities}
						/>
						<SettingsSentMessages
							t={t}
							identity={identities[selectedIdentityId]}
							isExternalAccount={false}
							updateIdentities={updateIdentities}
							availableEmailAddresses={availableEmailAddresses}
						/>
					</>
				)}
			</Container>
		</>
	);
};
