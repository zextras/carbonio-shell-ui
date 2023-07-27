/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';

import { Container, useSnackbar } from '@zextras/carbonio-design-system';
import produce from 'immer';
import { map, find, isEmpty, reduce, findIndex, filter, size } from 'lodash';
import { useTranslation } from 'react-i18next';

import AccountsList from './components/account-settings/accounts-list';
import Delegates, { DelegatesProps, DelegateType } from './components/account-settings/delegates';
import PersonaSettings from './components/account-settings/persona-settings';
import PrimaryAccountSettings from './components/account-settings/primary-account-settings';
import SettingsSentMessages from './components/account-settings/settings-sent-messages';
import SettingsHeader, { SettingsHeaderProps } from './components/settings-header';
import {
	calculateNewIdentitiesState,
	defaultAsFirstOrderIdentities,
	getAvailableEmailAddresses,
	isPrimary,
	ResetComponentImperativeHandler
} from './components/utils';
import {
	BatchRequest,
	CreateIdentityResponse,
	DeleteIdentityResponse,
	ModifyIdentityResponse,
	ModifyPrefsResponse,
	CreateIdentityRequest,
	DeleteIdentityRequest,
	IdentityAttrs,
	AccountSettingsPrefs,
	ModifyPrefsRequest,
	GetRightsRequest,
	GetRightsResponse,
	AccountState
} from '../../types';
import type { ModifyIdentityRequest } from '../../types';
import { SHELL_APP_ID } from '../constants';
import { getSoapFetch } from '../network/fetch';
import { useAccountStore, useUserAccount, useUserSettings } from '../store/account';

function mapToCreateIdentityRequests(
	createRecord: Record<string, IdentityAttrs>
): Array<CreateIdentityRequest> {
	return map(
		createRecord,
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

function mapToDeleteIdentityRequests(deleteArray: Array<string>): Array<DeleteIdentityRequest> {
	return map(
		deleteArray,
		(identityId, index): DeleteIdentityRequest => ({
			_jsns: 'urn:zimbraAccount',
			identity: { id: identityId },
			requestId: index.toString()
		})
	);
}

function mapToModifyIdentityRequests(
	modifyRecord: Record<string, Partial<IdentityAttrs>>
): Array<ModifyIdentityRequest> {
	return map(
		modifyRecord.current,
		(item, index): ModifyIdentityRequest => ({
			_jsns: 'urn:zimbraAccount',
			identity: {
				id: index,
				_attrs: item
			}
		})
	);
}

export const AccountsSettings = (): JSX.Element => {
	const [t] = useTranslation();
	const createSnackbar = useSnackbar();

	const account = useUserAccount();
	const settings = useUserSettings();

	const createRecordRef = useRef<Record<string, IdentityAttrs>>({});
	const deleteArrayRef = useRef<Array<string>>([]);
	const modifyRecordRef = useRef<Record<string, Partial<IdentityAttrs>>>({});

	const delegatedSendSaveTargetRef = useRef<
		AccountSettingsPrefs['zimbraPrefDelegatedSendSaveTarget']
	>(settings.prefs.zimbraPrefDelegatedSendSaveTarget);

	const [isDirty, setIsDirty] = useState(false);
	const calculateIsDirty = useCallback(() => {
		setIsDirty(
			!isEmpty(createRecordRef.current) ||
				!isEmpty(deleteArrayRef.current) ||
				!isEmpty(modifyRecordRef.current) ||
				settings.prefs.zimbraPrefDelegatedSendSaveTarget !== delegatedSendSaveTargetRef.current
		);
	}, [settings.prefs.zimbraPrefDelegatedSendSaveTarget]);

	const updateDelegatedSendSaveTarget = useCallback<
		DelegatesProps['updateDelegatedSendSaveTarget']
	>(
		(updatedValue) => {
			delegatedSendSaveTargetRef.current = updatedValue;
			calculateIsDirty();
		},
		[calculateIsDirty]
	);

	const resetLists = useCallback(() => {
		createRecordRef.current = {};
		deleteArrayRef.current = [];
		modifyRecordRef.current = {};
		calculateIsDirty();
	}, [calculateIsDirty]);

	const [selectedIdentityId, setSelectedIdentityId] = useState(0);

	const identitiesDefault = useMemo(
		() => defaultAsFirstOrderIdentities(account.identities.identity),
		[account.identities.identity]
	);

	const [identities, setIdentities] = useState<typeof identitiesDefault>(identitiesDefault);
	const maxIdentities = settings.attrs.zimbraIdentityMaxNumEntries || 0;

	const addIdentity = useCallback<(id: string, identityAttrs: IdentityAttrs) => void>(
		(id, identityAttrs) => {
			createRecordRef.current[id] = identityAttrs;
			calculateIsDirty();
			setIdentities((prevState) => [
				...prevState,
				{
					id,
					name: identityAttrs.zimbraPrefIdentityName,
					_attrs: { ...identityAttrs, zimbraPrefIdentityId: id }
				}
			]);
		},
		[calculateIsDirty]
	);

	const updateIdentities = useCallback<
		<K extends keyof IdentityAttrs>(id: string, key: K, value: IdentityAttrs[K]) => void
	>(
		(id, key, value) => {
			if (createRecordRef.current[id]) {
				createRecordRef.current[id][key] = value;
			} else if (modifyRecordRef.current[id]) {
				const actualIdentity = find(identitiesDefault, (item) => item.id === id);
				modifyRecordRef.current[id][key] = value;
				if (actualIdentity && actualIdentity._attrs[key] === value) {
					delete modifyRecordRef.current[id][key];
				}
				if (size(modifyRecordRef.current[id]) === 0) {
					delete modifyRecordRef.current[id];
				}
			} else {
				modifyRecordRef.current[id] = {
					[key]: value
				};
			}
			calculateIsDirty();
			setIdentities((prevState) =>
				map(prevState, (item) =>
					item.id === id
						? {
								...item,
								_attrs: {
									...item._attrs,
									[key]: value
								}
						  }
						: item
				)
			);
		},
		[calculateIsDirty, identitiesDefault]
	);

	const removeIdentity = useCallback(
		(identityId: string) => {
			if (createRecordRef.current[identityId]) {
				delete createRecordRef.current[identityId];
			} else {
				deleteArrayRef.current = [...deleteArrayRef.current, identityId];
				delete modifyRecordRef.current[identityId];
			}
			calculateIsDirty();
			setIdentities((prevState) => filter(prevState, (identity) => identity.id !== identityId));
		},
		[calculateIsDirty]
	);

	useEffect(() => {
		setIdentities(identitiesDefault);
		resetLists();
	}, [identitiesDefault, resetLists]);

	const onSave = useCallback<SettingsHeaderProps['onSave']>(() => {
		if (
			identitiesDefault.length + size(createRecordRef.current) - deleteArrayRef.current.length >
			maxIdentities
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

		let modifyPrefsRequest: ModifyPrefsRequest | undefined;

		if (
			delegatedSendSaveTargetRef.current &&
			settings.prefs.zimbraPrefDelegatedSendSaveTarget !== delegatedSendSaveTargetRef.current
		) {
			modifyPrefsRequest = {
				_jsns: 'urn:zimbraAccount',
				_attrs: { zimbraPrefDelegatedSendSaveTarget: delegatedSendSaveTargetRef.current }
			};
		}

		const createIdentityRequests: Array<CreateIdentityRequest> = mapToCreateIdentityRequests(
			createRecordRef.current
		);
		const deleteRequests: Array<DeleteIdentityRequest> = mapToDeleteIdentityRequests(
			deleteArrayRef.current
		);

		const modifyIdentityRequests: Array<ModifyIdentityRequest> = mapToModifyIdentityRequests(
			modifyRecordRef.current
		);

		const promise = getSoapFetch(SHELL_APP_ID)<
			BatchRequest,
			{
				ModifyIdentityResponse?: ModifyIdentityResponse[];
				DeleteIdentityResponse?: DeleteIdentityResponse[];
				CreateIdentityResponse?: CreateIdentityResponse[];
				ModifyPrefsResponse?: ModifyPrefsResponse;
			}
		>('Batch', {
			_jsns: 'urn:zimbra',
			DeleteIdentityRequest: deleteRequests.length > 0 ? deleteRequests : undefined,
			CreateIdentityRequest: createIdentityRequests.length > 0 ? createIdentityRequests : undefined,
			ModifyIdentityRequest: modifyIdentityRequests.length > 0 ? modifyIdentityRequests : undefined,
			ModifyPrefsRequest: modifyPrefsRequest
		})
			.then((res) => {
				createSnackbar({
					key: `new`,
					replace: true,
					type: 'info',
					label: t('message.snackbar.settings_saved', 'Edits saved correctly'),
					autoHideTimeout: 3000,
					hideButton: true
				});
				resetLists();
				useAccountStore.setState(
					produce((prevState: AccountState) => {
						if (prevState.account) {
							prevState.account.identities.identity = calculateNewIdentitiesState(
								prevState.account.identities.identity,
								deleteArrayRef.current,
								map(res.CreateIdentityResponse, (item) => item.identity[0]),
								modifyRecordRef.current
							);
							prevState.account.displayName =
								find(
									modifyRecordRef.current,
									(item) => item.zimbraPrefIdentityId === prevState?.account?.id
								)?.zimbraPrefIdentityName || prevState.account?.displayName;
						}
						prevState.settings.prefs.zimbraPrefDelegatedSendSaveTarget =
							delegatedSendSaveTargetRef.current || '';
					})
				);
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
		maxIdentities,
		identitiesDefault.length,
		settings.prefs.zimbraPrefDelegatedSendSaveTarget,
		createSnackbar,
		t,
		resetLists
	]);

	const availableEmailAddresses = useMemo(
		() => getAvailableEmailAddresses(account, settings),
		[account, settings]
	);

	const delegatesSettingsSectionRef = useRef<ResetComponentImperativeHandler>(null);

	const onCancel = useCallback(() => {
		resetLists();
		setIdentities(identitiesDefault);
		delegatesSettingsSectionRef.current?.reset();
		setSelectedIdentityId(size(identitiesDefault) - 1);
	}, [identitiesDefault, resetLists]);

	const [delegates, setDelegates] = useState<DelegateType[]>([]);

	useEffect(() => {
		getSoapFetch(SHELL_APP_ID)<GetRightsRequest, GetRightsResponse>('GetRights', {
			_jsns: 'urn:zimbraAccount',
			ace: [{ right: 'sendAs' }, { right: 'sendOnBehalfOf' }]
		}).then((value) => {
			if (value.ace) {
				const { ace } = value;
				const result = reduce(
					ace,
					(accumulator: Array<DelegateType>, item, idx) => {
						const index = findIndex(accumulator, { email: item.d });
						if (index === -1) {
							accumulator.push({ email: item.d || '', right: item.right, id: idx.toString() });
						} else {
							accumulator.push({
								email: item.d || '',
								right: `${item.right} and ${accumulator[index].right}`,
								id: idx.toString()
							});
							accumulator.splice(index, 1);
						}
						return accumulator;
					},
					[]
				);
				setDelegates(result);
			}
		});
	}, []);

	const personaSettings = useMemo<JSX.Element | null>(() => {
		const identity = identities[selectedIdentityId];
		if (identity) {
			return (
				<PersonaSettings identityAttrs={identity._attrs} updateIdentities={updateIdentities} />
			);
		}
		return null;
	}, [identities, selectedIdentityId, updateIdentities]);

	const settingsSentMessages = useMemo<JSX.Element | null>(() => {
		const identity = identities[selectedIdentityId];
		if (identity) {
			return (
				<SettingsSentMessages
					identityAttrs={identity._attrs}
					updateIdentities={updateIdentities}
					availableEmailAddresses={availableEmailAddresses}
				/>
			);
		}
		return null;
	}, [availableEmailAddresses, identities, selectedIdentityId, updateIdentities]);

	return (
		<>
			<SettingsHeader
				onSave={onSave}
				onCancel={onCancel}
				isDirty={isDirty}
				title={t('label.accounts', 'Accounts')}
			/>
			<Container background={'gray5'} padding={{ top: 'large' }} height="fit" />
			<Container
				background={'gray5'}
				mainAlignment="flex-start"
				padding={{ all: 'large' }}
				style={{ overflow: 'auto' }}
			>
				<AccountsList
					accountName={account.name}
					identities={identities}
					selectedIdentityId={selectedIdentityId}
					setSelectedIdentityId={setSelectedIdentityId}
					removeIdentity={removeIdentity}
					addIdentity={addIdentity}
					identitiesDefault={identitiesDefault}
				/>
				{isPrimary(identities[selectedIdentityId]) ? (
					<>
						<PrimaryAccountSettings
							account={account}
							identity={identities[0]}
							updateIdentities={updateIdentities}
						/>
						{settingsSentMessages}
						<Delegates
							updateDelegatedSendSaveTarget={updateDelegatedSendSaveTarget}
							delegatedSendSaveTarget={settings.prefs.zimbraPrefDelegatedSendSaveTarget}
							resetRef={delegatesSettingsSectionRef}
							delegates={delegates}
						/>
					</>
				) : (
					<>
						{personaSettings}
						{settingsSentMessages}
					</>
				)}
			</Container>
		</>
	);
};
