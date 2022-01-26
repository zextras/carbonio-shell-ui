/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo, useState, useEffect, FC, ReactElement } from 'react';
import {
	Button,
	Container,
	Divider,
	useSnackbar,
	Row,
	Text
} from '@zextras/carbonio-design-system';
import { useTranslation, TFunction } from 'react-i18next';
import { map, filter, includes, findIndex, reduce, forEach } from 'lodash';
import { useUserAccount } from '../store/account/hooks';
import { editSettings } from '../network/edit-settings';
import { SHELL_APP_ID } from '../constants';
import { Mods, IdentityProps, CreateIdentityProps } from '../../types';
import { useAccountStore } from '../store/account/store';
import AccountsList from './components/account-settings/accounts-list';
import PrimaryAccountSettings from './components/account-settings/primary-account-settings';
import SettingsSentMessages from './components/account-settings/settings-sent-messages';
import PasswordRecoverySettings from './components/account-settings/password-recovery-settings';
import Delegates from './components/account-settings/delegates';
import PersonaSettings from './components/account-settings/persona-settings';
import UsePersona from './components/account-settings/use-persona';
// external accounts not yet activated, graphical part is complete
// import ExternalAccount from './components/account-settings/external-account-settings';
// import AdvancedSettings from './components/account-settings/advanced-settings';
// import DownloadMessages from './components/account-settings/download-messages';

export const DisplayerHeader: FC<{
	onSave: (mods: Record<string, unknown>) => void;
	mods: Record<string, unknown>;
	t: TFunction;
}> = ({ onSave, mods, t }) => {
	const accountLabel: string = useMemo(() => t('label.accounts', 'Accounts'), [t]);
	const buttonLabel = useMemo(() => t('label.save', 'Save'), [t]);
	return (
		<Container
			orientation="vertical"
			mainAlignment="flex-start"
			height="fit"
			background="gray5"
			padding={{ bottom: 'medium', right: 'medium' }}
		>
			<Row orientation="horizontal" width="100%">
				<Row
					padding={{ all: 'small' }}
					mainAlignment="flex-start"
					width="50%"
					crossAlignment="flex-start"
				>
					<Text size="large" weight="regular">
						{accountLabel}
					</Text>
				</Row>
				<Row
					padding={{ all: 'small' }}
					width="50%"
					mainAlignment="flex-end"
					crossAlignment="flex-end"
				>
					<Button
						label={buttonLabel}
						color="primary"
						onClick={onSave}
						disabled={Object.keys(mods).length === 0}
					/>
				</Row>
			</Row>
			<Divider />
		</Container>
	);
};

const AccountsSettings = (): ReactElement => {
	const [mods, setMods] = useState<Mods>({});
	const [t] = useTranslation();
	const accountSettings = useUserAccount();
	const [activeDelegateView, setActiveDelegateView] = useState('0');
	const addMod = useCallback(
		(
			type: 'props' | 'prefs' | 'identity',
			id: string | undefined,
			key: any,
			value?: string,
			action?: string,
			deleteList?: string[],
			createList?: CreateIdentityProps
		) => {
			setMods((m) => ({
				...m,

				[type]: { id, action, deleteList, createList, ...m?.[type], [key]: value }
			}));
		},
		[]
	);

	const createIdentities = useCallback(
		(createList) => {
			addMod('identity', undefined, undefined, undefined, 'create', undefined, createList);
		},
		[addMod]
	);

	const updateIdentities = useCallback(
		(id, key, pref) => {
			addMod('identity', id, key, pref, 'modify', undefined, undefined);
		},
		[addMod]
	);

	const deleteIdentities = useCallback(
		(deleteList: string[]) => {
			addMod('identity', undefined, undefined, undefined, 'delete', deleteList);
		},
		[addMod]
	);

	const createSnackbar = useSnackbar();

	type UserRightsProps = { email: string; right: string };

	type DelegateProps = {
		id: string;
		email: string;
		right: string;
	};

	const [delegates, setDelegates] = useState<DelegateProps[]>([]);

	useEffect(() => {
		if (accountSettings && Object.keys(accountSettings).length > 0) {
			useAccountStore
				.getState()
				.xmlSoapFetch(SHELL_APP_ID)(
					'GetRights',
					`<GetRightsRequest xmlns="urn:zimbraAccount"></GetRightsRequest>`
				)
				.then((res: any) => {
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
		}
	}, [accountSettings]);

	const identitiesDefault = useMemo(() => {
		const temp = map(accountSettings?.identities.identity, (item, index) => ({
			id: item.name === 'DEFAULT' ? '0' : (index + 1).toString(),
			type: item.name === 'DEFAULT' ? t('label.primary', 'Primary') : t('label.persona', 'Persona'),
			identityId: item._attrs.zimbraPrefIdentityId || ' ',
			fromAddress: item._attrs.zimbraPrefFromAddress || ' ',
			identityName: item._attrs.zimbraPrefIdentityName || ' ',
			fromDisplay: item._attrs.zimbraPrefFromDisplay || ' ',
			recoveryAccount: item._attrs.zimbraRecoveryAccount || ' ',
			replyToDisplay: item._attrs.zimbraPrefReplyToDisplay || ' ',
			replyToAddress: item._attrs.zimbraPrefReplyToAddress || ' ',
			replyToEnabled: item._attrs.zimbraPrefReplyToEnabled || ' ',
			saveToSent: item._attrs.zimbraPrefSaveToSent || ' ',
			sentMailFolder: item._attrs.zimbraPrefSentMailFolder || ' ',
			whenInFoldersEnabled: item._attrs.zimbraPrefWhenInFoldersEnabled || ' ',
			whenSentToEnabled: item._attrs.zimbraPrefWhenSentToEnabled || ' ',
			whenSentToAddresses: item._attrs.zimbraPrefWhenSentToAddresses || ' '
		}));
		const result = [temp[temp.length - 1], ...temp];
		result.pop();
		return result;
	}, [accountSettings, t]);

	const [identities, setIdentities] = useState<IdentityProps[]>(identitiesDefault);

	useEffect(() => {
		setIdentities(identitiesDefault);
	}, [accountSettings, identitiesDefault]);

	const [selectedIdentityId, setSelectedIdentityId] = useState(0);

	const onSave = useCallback(() => {
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

		const modsKeys = filter(Object.keys(Object.values(mods)[0]), (item) => item.includes('zimbra'));

		forEach(modsKeys, (key, index) => {
			const zimbraPrefKeyIndex = findIndex(
				Object.keys(Object.values(mods)[0]),
				(item) => item === modsKeys[index]
			);
			const modsValue = Object.values(Object.values(mods)[0])[zimbraPrefKeyIndex];
			filter(
				accountSettings.identities.identity,
				(item) => item.id === mods.identity?.id
			)[0]._attrs[key] = modsValue;

			setIdentities(
				map(identities, (item) =>
					item.identityId === mods.identity?.id && key === 'zimbraPrefIdentityName'
						? { ...item, identityName: modsValue }
						: item
				)
			);
		});
		setMods({});
	}, [mods, createSnackbar, t, identities, accountSettings]);

	return (
		<>
			<DisplayerHeader mods={mods} onSave={onSave} t={t} />
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
					setMods={setMods}
					deleteIdentities={deleteIdentities}
					createIdentities={createIdentities}
				/>
				{identities[selectedIdentityId]?.type === t('label.primary', 'Primary') && (
					<>
						<PrimaryAccountSettings
							t={t}
							items={identities[0]}
							updateIdentities={updateIdentities}
							setMods={setMods}
						/>
						<SettingsSentMessages
							t={t}
							items={identities[selectedIdentityId]}
							isExternalAccount={false}
							updateIdentities={updateIdentities}
							setMods={setMods}
						/>
						<PasswordRecoverySettings
							t={t}
							items={identities[selectedIdentityId]}
							identities={identities}
							setIdentities={setIdentities}
						/>
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
							setMods={setMods}
						/>
						<SettingsSentMessages
							t={t}
							items={identities[selectedIdentityId]}
							isExternalAccount={false}
							updateIdentities={updateIdentities}
							setMods={setMods}
						/>
						<UsePersona
							t={t}
							items={identities[selectedIdentityId]}
							updateIdentities={updateIdentities}
							setMods={setMods}
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

export default AccountsSettings;
