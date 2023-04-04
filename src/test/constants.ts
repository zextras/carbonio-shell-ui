/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const DEFAULT_ID = 'logged-user-id';
export const LOGGED_USER = {
	id: DEFAULT_ID,
	name: 'Logged User',
	prefs: {},
	attrs: {
		displayName: 'Logged User'
	},
	props: [],
	identities: {
		identity: [
			{
				name: 'DEFAULT',
				id: DEFAULT_ID
			}
		]
	}
};
