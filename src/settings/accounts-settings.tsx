/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo, useState, useEffect, ReactElement } from 'react';
import { Container, useSnackbar } from '@zextras/carbonio-design-system';
import { TFunction } from 'react-i18next';
import { map, includes, findIndex, reduce, find, replace, lowerFirst, isEmpty } from 'lodash';
import { useUserSettings } from '../store/account/hooks';
import { editSettings } from '../network/edit-settings';
import { SHELL_APP_ID } from '../constants';
import { Mods, IdentityProps, CreateIdentityProps } from '../../types';
import { useAccountStore } from '../store/account/store';
import AccountsList from './components/account-settings/accounts-list';
import PrimaryAccountSettings from './components/account-settings/primary-account-settings';
import SettingsSentMessages from './components/account-settings/settings-sent-messages';
import PasswordRecoverySettings from './components/account-settings/password-recovery-settings';
import Delegates, { DelegateType } from './components/account-settings/delegates';
import PersonaSettings from './components/account-settings/persona-settings';
import PersonaUseSection from './components/account-settings/persona-use-section';
import SettingsHeader from './components/settings-header';
import { getXmlSoapFetch } from '../network/fetch';

// external accounts not yet activated, graphical part is complete
// import ExternalAccount from './components/account-settings/external-account-settings';
// import AdvancedSettings from './components/account-settings/advanced-settings';
// import DownloadMessages from './components/account-settings/download-messages';

type ModifyProps = { id: string | number; key: string; value: string | boolean } | undefined;
type AddModProps = {
	type: string;
	modifyProp?: ModifyProps;
	deleteList?: string[];
	createList?: { prefs: CreateIdentityProps }[];
};
type AccountSettingsProps = {
	identitiesDefault: IdentityProps[];
	t: TFunction;
};

type UserRightsProps = { email: string; right: string };
export const AccountsSettings = ({ identitiesDefault, t }: AccountSettingsProps): ReactElement => {
	const [mods, setMods] = useState<Mods>({});
	const [activeDelegateView, setActiveDelegateView] = useState('0');
	const [selectedIdentityId, setSelectedIdentityId] = useState(0);
	const [identities, setIdentities] = useState<IdentityProps[]>(identitiesDefault);
	const [delegates, setDelegates] = useState<DelegateType[]>([]);

	const maxIdentities = useUserSettings().attrs.zimbraIdentityMaxNumEntries;
	const addMod = useCallback(
		(arg: AddModProps) => {
			const { type, modifyProp, deleteList, createList } = arg;
			setMods((prevState) => {
				const prevRecord = find(
					prevState?.identity?.modifyList,
					(item) => item.id === modifyProp?.id
				)?.prefs;
				const modifyList =
					typeof modifyProp !== 'undefined'
						? {
								...prevState.identity?.modifyList,
								[modifyProp.id]: {
									id: modifyProp.id,
									prefs: { ...prevRecord, [modifyProp.key]: modifyProp.value }
								}
						  }
						: prevState.identity?.modifyList;
				const newCreateList = prevState.identity?.createList || createList;
				const newDeleteList = prevState.identity?.deleteList || deleteList;
				return {
					...prevState,

					[type]: {
						deleteList: newDeleteList,
						createList: newCreateList,
						modifyList
					}
				};
			});
		},
		[setMods]
	);

	const modifyCreateList = useCallback((arg: AddModProps) => {
		const { type, modifyProp } = arg;
		setMods((prevState) => {
			const prevRecord = find(
				prevState?.identity?.createList,
				(item) => item.prefs.requestId === modifyProp?.id
			)?.prefs;
			const modifiedCreateList =
				typeof modifyProp !== 'undefined'
					? {
							...prevState.identity?.createList,
							[modifyProp.id]: {
								prefs: { ...prevRecord, [modifyProp.key]: modifyProp.value }
							}
					  }
					: undefined;
			return {
				...prevState,

				[type]: {
					createList: modifiedCreateList,
					deleteList: prevState.identity?.deleteList,
					modifyList: prevState.identity?.modifyList
				}
			};
		});
	}, []);
	const createIdentities = useCallback(
		(createList: { prefs: CreateIdentityProps }[]) => {
			const arg = {
				type: 'identity',
				createList
			};
			addMod(arg);
		},
		[addMod]
	);

	const updateIdentities = useCallback(
		(modifyProp: { id: string | number; key: string; value: string | boolean }) => {
			const arg = {
				type: 'identity',
				modifyProp: { id: modifyProp.id, key: modifyProp.key, value: modifyProp.value }
			};
			if (typeof modifyProp.id === 'string') {
				addMod(arg);
			} else if (typeof modifyProp.id === 'number') {
				modifyCreateList(arg);
			}
			const updatedIdentityKey = lowerFirst(replace(modifyProp.key, 'zimbraPref', ''));
			setIdentities(
				map(identities, (item) =>
					item.identityId === modifyProp.id
						? { ...item, [updatedIdentityKey]: modifyProp.value }
						: item
				)
			);
		},
		[addMod, identities, modifyCreateList]
	);

	const deleteIdentities = useCallback(
		(deleteList: string[]) => {
			const arg = {
				type: 'identity',
				deleteList
			};
			addMod(arg);
		},
		[addMod]
	);

	const createSnackbar = useSnackbar();

	useEffect(() => {
		getXmlSoapFetch(SHELL_APP_ID)(
			'GetRights',
			`<GetRightsRequest xmlns="urn:zimbraAccount"></GetRightsRequest>`
		).then((res: any) => {
			if (res.ace) {
				const tempResult: UserRightsProps[] = map(res.ace, (item) => ({
					email: item.d,
					right: item.right
				}));
				const resultReduced = reduce(
					tempResult,
					(result: UserRightsProps[], item) => {
						const index = findIndex(result, { email: item.email });
						if (index === -1) {
							result.push({ email: item.email, right: item.right });
						} else {
							result.push({
								email: item.email,
								right: `${item.right} and ${result[index].right}`
							});
							result.splice(index, 1);
						}
						return result;
					},
					[]
				);
				const result = map(resultReduced, (item: UserRightsProps, index) => ({
					...item,
					id: index.toString()
				}));
				setDelegates(result);
			}
		});
	}, []);

	useEffect(() => {
		setIdentities(identitiesDefault);
		setMods({});
	}, [identitiesDefault]);

	const onSave = useCallback(() => {
		if (
			identitiesDefault.length +
				(mods.identity?.createList?.length || 0) -
				(mods?.identity?.deleteList?.length || 0) >
			maxIdentities
		) {
			createSnackbar({
				key: `new`,
				replace: true,
				type: 'error',
				label: t(
					'message.snackbar.identities_quota_exceeded',
					'The identitity could not be created because you have exceeded your identity quota'
				),
				autoHideTimeout: 5000,
				hideButton: true
			});
			return;
		}
		editSettings(mods)
			.then(() => {
				createSnackbar({
					key: `new`,
					replace: true,
					type: 'info',
					label: t('message.snackbar.settings_saved', 'Edits saved correctly'),
					autoHideTimeout: 3000,
					hideButton: true
				});
			})
			.catch(() => {
				createSnackbar({
					key: `new`,
					replace: true,
					type: 'error',
					label: t('snackbar.error', 'Something went wrong, please try again'),
					autoHideTimeout: 3000,
					hideButton: true
				});
			});
		setMods({});
	}, [identitiesDefault.length, mods, maxIdentities, createSnackbar, t]);

	const onCancel = useCallback(() => setMods({}), []);
	const title: string = useMemo(() => t('label.accounts', 'Accounts'), [t]);
	const isDirty = useMemo(() => !isEmpty(mods), [mods]);
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
					identities={identities}
					setIdentities={setIdentities}
					selectedIdentityId={selectedIdentityId}
					setSelectedIdentityId={setSelectedIdentityId}
					deleteIdentities={deleteIdentities}
					createIdentities={createIdentities}
				/>
				{identities[selectedIdentityId]?.type === t('label.primary', 'Primary') && (
					<>
						<PrimaryAccountSettings
							t={t}
							items={identities[0]}
							updateIdentities={updateIdentities}
						/>
						<SettingsSentMessages
							t={t}
							items={identities[selectedIdentityId]}
							isExternalAccount={false}
							updateIdentities={updateIdentities}
						/>
						{/* <PasswordRecoverySettings
							t={t}
							items={identities[selectedIdentityId]}
							createSnackbar={createSnackbar}
						/> */}
						<Delegates
							t={t}
							items={delegates}
							activeDelegateView={activeDelegateView}
							setActiveDelegateView={setActiveDelegateView}
						/>
					</>
				)}
				{identities[selectedIdentityId]?.type === t('label.persona', 'Persona') && (
					<>
						<PersonaSettings
							t={t}
							items={identities[selectedIdentityId]}
							updateIdentities={updateIdentities}
						/>
						<SettingsSentMessages
							t={t}
							items={identities[selectedIdentityId]}
							isExternalAccount={false}
							updateIdentities={updateIdentities}
						/>
						<PersonaUseSection
							t={t}
							items={identities[selectedIdentityId]}
							updateIdentities={updateIdentities}
						/>
					</>
				)}
				{includes(['IMAP', 'POP'], identities[selectedIdentityId]?.type) && (
					<>
						{/* <ExternalAccount t={t} items={identities} />
						<AdvancedSettings t={t} items={identities} />
						<DownloadMessages t={t} items={identities} />
						<SettingsSentMessages
							t={t}
							items={identities[selectedIdentityId]}
							isExternalAccount
							updateIdentities={updateIdentities}
							setMods={setMods}
						/> */}
					</>
				)}
			</Container>
		</>
	);
};
