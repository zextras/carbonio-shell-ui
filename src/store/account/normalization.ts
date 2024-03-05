/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { GetInfoResponse, Account, AccountSettings } from '../../../types';

const normalizeSettings = (
	settings: Pick<GetInfoResponse, 'attrs' | 'prefs' | 'props'>
): AccountSettings => ({
	attrs: settings.attrs._attrs,
	prefs: settings.prefs._attrs,
	props: settings.props.prop ?? []
});

export const normalizeAccount = ({
	id,
	name,
	attrs,
	prefs,
	identities,
	signatures,
	props,
	version,
	rights
}: GetInfoResponse): {
	account: Account;
	settings: AccountSettings;
	version: string;
} => {
	const settings = normalizeSettings({ attrs, prefs, props });
	return {
		account: {
			id,
			name,
			displayName: attrs._attrs.displayName,
			identities,
			signatures,
			rights
		},
		settings,
		version
	};
};
