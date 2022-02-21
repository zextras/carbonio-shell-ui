/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { filter, find, findIndex, forEach, map, reduce } from 'lodash';
import { SHELL_APP_ID } from '../constants';
import { useAccountStore } from '../store/account/store';
import { AccountState, Mods, Account } from '../../types';

export const editSettings = (mods: Mods, appId: string = SHELL_APP_ID): Promise<any> =>
	useAccountStore
		.getState()
		.xmlSoapFetch(SHELL_APP_ID)(
			'Batch',
			`<BatchRequest xmlns="urn:zimbra" onerror="stop">${
				mods.props
					? `<ModifyPropertiesRequest xmlns="urn:zimbraAccount">${map(
							mods.props,
							(prop, key) =>
								`<prop name="${key}" zimlet="${prop.app ?? appId}">${prop.value}</prop>`
					  )}</ModifyPropertiesRequest>`
					: ''
			}
	${
		mods.prefs
			? `<ModifyPrefsRequest xmlns="urn:zimbraAccount">${map(
					mods.prefs,
					(pref, key) => `<pref name="${key}">${pref}</pref>`
			  ).join('')}</ModifyPrefsRequest>`
			: ''
	}
	${
		mods.identity?.modifyList
			? map(
					mods.identity.modifyList,
					(item) =>
						`<ModifyIdentityRequest xmlns="urn:zimbraAccount" requestId="0"><identity id="${
							item.id
						}">${map(item.prefs, (value, key) => `<a name="${key}">${value}</a>`).join(
							''
						)}<a name="zimbraPrefFromAddressType">sendAs</a></identity></ModifyIdentityRequest>`
			  ).join('')
			: ''
	}
	${
		mods.identity?.deleteList
			? map(
					mods.identity.deleteList,
					(item) =>
						`<DeleteIdentityRequest xmlns="urn:zimbraAccount" requestId="0"><identity id="${item}"/></DeleteIdentityRequest>`
			  ).join('')
			: ''
	}
	${
		mods.identity?.createList
			? map(
					mods.identity.createList,
					(item) =>
						`<CreateIdentityRequest xmlns="urn:zimbraAccount" requestId="${item.prefs.requestId}"><identity name="${item.prefs.zimbraPrefIdentityName}"><a name="zimbraPrefIdentityName">${item.prefs.zimbraPrefIdentityName}</a><a name="zimbraPrefFromDisplay">${item.prefs.zimbraPrefFromDisplay}</a><a name="zimbraPrefFromAddress">${item.prefs.zimbraPrefFromAddress}</a><a name="zimbraPrefFromAddressType">sendAs</a><a name="zimbraPrefReplyToEnabled">${item.prefs.zimbraPrefReplyToEnabled}</a><a name="zimbraPrefReplyToDisplay">${item.prefs.zimbraPrefReplyToDisplay}</a><a name="zimbraPrefReplyToAddress">${item.prefs.zimbraPrefReplyToAddress}</a><a name="zimbraPrefDefaultSignatureId">${item.prefs.zimbraPrefDefaultSignatureId}</a><a name="zimbraPrefForwardReplySignatureId">${item.prefs.zimbraPrefForwardReplySignatureId}</a><a name="zimbraPrefWhenSentToEnabled">${item.prefs.zimbraPrefWhenSentToEnabled}</a><a name="zimbraPrefWhenInFoldersEnabled">${item.prefs.zimbraPrefWhenInFoldersEnabled}</a></identity></CreateIdentityRequest>`
			  ).join('')
			: ''
	}
	${
		mods.permissions
			? `<RevokeRightsRequest xmlns="urn:zimbraAccount" requestId="0">${
					mods.permissions.freeBusy
						? map(mods.permissions.freeBusy.current, (right) => {
								if (right.gt === 'dom')
									return `<ace right="viewFreeBusy" gt="${right.gt}" zid="${right.zid}" d="zextras.com"/>`;
								if (right.gt === 'all' && right.deny)
									return `<ace right="viewFreeBusy" gt="${right.gt}" zid="${right.zid}" deny="1"/>`;
								if (right.gt === 'usr')
									return `<ace right="viewFreeBusy" gt="${right.gt}" zid="${right.zid}" d="${right.d}"/>`;
								return `<ace right="viewFreeBusy" gt="${right.gt}" zid="${right.zid}" />`;
						  }).join('')
						: ''
			  }${
					mods.permissions.inviteRight
						? map(mods.permissions.inviteRight.current, (right) => {
								if (right.gt === 'all' && right.deny)
									return `<ace right="invite" gt="${right.gt}" zid="${right.zid}" deny="1"/>`;
								if (right.gt === 'usr')
									return `<ace right="invite" gt="${right.gt}" zid="${right.zid}" d="${right.d}"/>`;
								return `<ace right="invite" gt="${right.gt}" zid="${right.zid}" />`;
						  }).join('')
						: ''
			  }</RevokeRightsRequest><GrantRightsRequest xmlns="urn:zimbraAccount" requestId="1">${
					mods.permissions.freeBusy
						? `${((): string => {
								if (mods.permissions.freeBusy.new.gt === 'dom') {
									return `<ace right="viewFreeBusy" gt="${mods.permissions.freeBusy.new.gt}" d="zextras.com"/>`;
								}
								if (
									mods.permissions.freeBusy.new.gt === 'all' &&
									mods.permissions.freeBusy.new.deny
								) {
									return `<ace right="viewFreeBusy" gt="${mods.permissions.freeBusy.new.gt}" deny="1"/>`;
								}
								if (mods.permissions.freeBusy.new.gt === 'usr') {
									// eslint-disable-next-line @typescript-eslint/ban-ts-comment
									// @ts-ignore
									return map(
										mods.permissions.freeBusy.new.d,
										(u) =>
											`<ace right="viewFreeBusy" gt="${mods.permissions?.freeBusy.new.gt}" d="${u.email}"/>`
									).join('');
								}
								return `<ace right="viewFreeBusy" gt="${mods.permissions.freeBusy.new.gt}" />`;
						  })()}`
						: ''
			  }${
					mods.permissions.inviteRight
						? `${((): string => {
								if (
									mods.permissions.inviteRight.new.gt === 'all' &&
									mods.permissions.inviteRight.new.deny
								) {
									return `<ace right="invite" gt="${mods.permissions.inviteRight.new.gt}" deny="1"/>`;
								}
								if (mods.permissions.inviteRight.new.gt === 'usr') {
									// eslint-disable-next-line @typescript-eslint/ban-ts-comment
									// @ts-ignore
									return map(
										mods.permissions.inviteRight.new.d,
										(u) =>
											`<ace right="invite" gt="${mods.permissions?.inviteRight.new.gt}" d="${u.email}"/>`
									).join('');
								}
								return `<ace right="invite" gt="${mods.permissions?.inviteRight.new.gt}" />`;
						  })()}`
						: ''
			  }
	</GrantRightsRequest>`
			: ''
	}</BatchRequest>`
		)
		.then((r: any) => {
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
				},
				account: {
					...s.account,
					displayName:
						find(mods?.identity?.modifyList, (item) => item.id === s?.account?.id)?.prefs
							.zimbraPrefIdentityName || s.account?.displayName,
					name:
						find(mods?.identity?.modifyList, (item) => item.id === s?.account?.id)?.prefs
							.zimbraPrefFromAddress || s.account?.name,
					identities: {
						identity:
							typeof s.account !== 'undefined'
								? reduce(
										mods?.identity?.modifyList,
										(acc, { id, prefs }) => {
											const tempResult = [];
											const propIndex = findIndex(
												acc,
												(itemMods, indexAccount) => acc[indexAccount].id === id
											);
											if (propIndex > -1) {
												forEach(Object.keys(prefs), (item, _index) => {
													// eslint-disable-next-line no-param-reassign
													acc[propIndex]._attrs[item] = Object.values(prefs)[_index];
													if (
														item === 'zimbraPrefIdentityName' &&
														acc[propIndex].name !== 'DEFAULT'
													) {
														// eslint-disable-next-line no-param-reassign
														acc[propIndex].name = Object.values(prefs)[_index];
													}
												});
												tempResult.push(prefs);
											}
											return acc;
										},
										[
											...filter(
												s.account.identities.identity,
												(item) => !mods?.identity?.deleteList?.includes(item.id)
											).filter((i) => i.name !== 'DEFAULT'),
											...map(r?.CreateIdentityResponse, (item) => item.identity[0]),
											...filter(
												s.account.identities.identity,
												(item) => !mods?.identity?.deleteList?.includes(item.id)
											).filter((i) => i.name === 'DEFAULT')
										]
								  )
								: undefined
					}
				} as Account
			}));
			return r;
		});

export const getEditSettingsForApp =
	(app: string) =>
	(mods: Mods): Promise<any> =>
		editSettings(mods, app).then((r) => {
			r.type = 'fulfilled';
			return r;
		});
