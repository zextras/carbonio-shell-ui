/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { findIndex, map, reduce } from 'lodash';
import { SHELL_APP_ID } from '../constants';
import { useAccountStore } from '../store/account/store';
import { AccountState, Mods } from '../../types';

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
		mods.identity?.action === 'modify'
			? `<ModifyIdentityRequest xmlns="urn:zimbraAccount" requestId="0"><identity id="${
					mods.identity.id
			  }">${map(mods.identity, (pref, key) => `<a name="${key}">${pref}</a>`).join(
					''
			  )}<a name="zimbraPrefFromAddressType">sendAs</a></identity></ModifyIdentityRequest>`
			: ''
	}
	${
		mods.identity?.action === 'delete'
			? map(
					mods.identity.deleteList,
					(item) =>
						`<DeleteIdentityRequest xmlns="urn:zimbraAccount" requestId="0"><identity id="${item}"/></DeleteIdentityRequest>`
			  ).join('')
			: ''
	}
	${
		mods.identity?.action === 'create'
			? map(
					mods.identity.createList,
					(item) =>
						`<CreateIdentityRequest xmlns="urn:zimbraAccount" requestId="${item.prefs.requestId}"><identity name="${item.prefs.zimbraPrefIdentityName}"><a name="zimbraPrefIdentityName">${item.prefs.zimbraPrefIdentityName}</a><a name="zimbraPrefFromDisplay">${item.prefs.zimbraPrefFromDisplay}</a><a name="zimbraPrefFromAddress">${item.prefs.zimbraPrefFromAddress}</a><a name="zimbraPrefFromAddressType">sendAs</a><a name="zimbraPrefReplyToEnabled">FALSE</a><a name="zimbraPrefReplyToDisplay"></a><a name="zimbraPrefReplyToAddress"></a><a name="zimbraPrefDefaultSignatureId"></a><a name="zimbraPrefForwardReplySignatureId"></a><a name="zimbraPrefWhenSentToEnabled">FALSE</a><a name="zimbraPrefWhenInFoldersEnabled">FALSE</a></identity></CreateIdentityRequest>`
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
		.then((r) => {
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
			return r;
		});

export const getEditSettingsForApp =
	(app: string) =>
	(mods: Mods): Promise<any> =>
		editSettings(mods, app).then((r) => {
			r.type = 'fulfilled';
			return r;
		});
