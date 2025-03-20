/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const SHELL_APP_ID = 'carbonio-shell-ui';

export const DELEGATED_SEND_SAVE_TARGET = ['owner', 'sender', 'both', 'none'];

export const JSNS = {
	account: 'urn:zimbraAccount',
	admin: 'urn:zimbraAdmin',
	mail: 'urn:zimbraMail',
	all: 'urn:zimbra',
	sync: 'urn:zimbraSync'
} as const;
