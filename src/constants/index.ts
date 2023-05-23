/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { DynamicThemeFix } from 'darkreader';

/*
	reference: https://zextras.atlassian.net/wiki/spaces/IRIS/pages/223215854/UI+Guidelines+and+theming
*/
export const ZIMBRA_STANDARD_COLORS = [
	{ zValue: 0, hex: '#000000', zLabel: 'black' },
	{ zValue: 1, hex: '#2b73d2', zLabel: 'blue' },
	{ zValue: 2, hex: '#29B6F6', zLabel: 'cyan' },
	{ zValue: 3, hex: '#66BB6A', zLabel: 'green' },
	{ zValue: 4, hex: '#7e57c2', zLabel: 'purple' },
	{ zValue: 5, hex: '#ef5350', zLabel: 'red' },
	{ zValue: 6, hex: '#ffc107', zLabel: 'yellow' },
	{ zValue: 7, hex: '#edaeab', zLabel: 'pink' },
	{ zValue: 8, hex: '#828282', zLabel: 'gray' },
	{ zValue: 9, hex: '#FF7043', zLabel: 'orange' }
];

export const FOLDERS = {
	USER_ROOT: '1',
	INBOX: '2',
	TRASH: '3',
	SPAM: '4',
	SENT: '5',
	DRAFTS: '6',
	CONTACTS: '7',
	TAGS: '8',
	CONVERSATIONS: '9',
	CALENDAR: '10',
	ROOT: '11',
	NOTEBOOK: '12', // no longer created in new mailboxes since Helix (bug 39647).  old mailboxes may still contain a system folder with id 12
	AUTO_CONTACTS: '13',
	IM_LOGS: '14',
	TASKS: '15',
	BRIEFCASE: '16',
	LAST_SYSTEM_FOLDER_POSITION: '16.1'
};

export const SHELL_APP_ID = 'carbonio-shell-ui';
export const SETTINGS_APP_ID = 'settings';
export const ACCOUNTS_APP_ID = 'accounts';
export const SEARCH_APP_ID = 'search';
export const ACTION_TYPES = {
	CONVERSATION: 'conversation',
	CONVERSATION_lIST: 'conversation_list',
	MESSAGE: 'message',
	MESSAGE_lIST: 'message_list',
	CONTACT: 'contact',
	CONTACT_lIST: 'contact_list',
	INVITE: 'invite',
	INVITE_lIST: 'invite_list',
	APPOINTMENT: 'appointment',
	APPOINTMENT_lIST: 'appointment_list',
	FOLDER: 'folder',
	FOLDER_lIST: 'folder_list',
	CALENDAR: 'calendar',
	CALENDAR_lIST: 'calendar_list',
	NEW: 'new'
};

export const darkReaderDynamicThemeFixes: DynamicThemeFix = {
	ignoreImageAnalysis: ['.no-dr-invert *'],
	invert: [],
	css: `
		.tox, .force-white-bg, .tox-swatches-menu, .tox .tox-edit-area__iframe {
			background-color: #fff !important;
			background: #fff !important;
		}
	`,
	ignoreInlineStyle: ['.tox-menu *'],
	disableStyleSheetsProxy: false
};

const base = '/carbonio/';

const standaloneBase = `${base}standalone`;

export const IS_STANDALONE = window.location.pathname.startsWith(standaloneBase);
export const BASENAME = IS_STANDALONE ? standaloneBase : base;
export const EMAIL_VALIDATION_REGEX =
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, max-len, no-control-regex
	/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const ROOT_NAME = 'USER_ROOT';

export const DARK_READER_VALUES = ['auto', 'enabled', 'disabled'] as const;

export const FOLDER_VIEW = {
	search_folder: 'search folder',
	tag: 'tag',
	conversation: 'conversation',
	message: 'message',
	contact: 'contact',
	document: 'document',
	appointment: 'appointment',
	virtual_conversation: 'virtual conversation',
	remote_folder: 'remote folder',
	wiki: 'wiki',
	task: 'task',
	chat: 'chat'
};
export const LOCAL_STORAGE_SETTINGS_KEY = 'settings';
export const LOCAL_STORAGE_LAST_PRIMARY_KEY = 'config';
export const LOCAL_STORAGE_SEARCH_KEY = 'search_suggestions';
export const LOCAL_STORAGE_BOARD_SIZE = 'board_size';
export const SCALING_OPTIONS = [
	{ value: 75, label: 'xs' },
	{ value: 87.5, label: 's' },
	{ value: 100, label: 'm' },
	{ value: 112.5, label: 'l' },
	{ value: 125, label: 'xl' }
] as const;
export const BASE_FONT_SIZE = 100;
export const SCALING_LIMIT = {
	WIDTH: 1400,
	HEIGHT: 900,
	DPR: 2 // device pixel ratio
} as const;

export const LOGIN_V3_CONFIG_PATH = '/zx/login/v3/config';
export const DARK_READER_PROP_KEY = 'zappDarkreaderMode';
export const SENTRY_SHELL_DSN = 'https://0ce2448c05b94f0182c47ae52c7ff52c@feedback.zextras.tools/6';
export const SENTRY_FEEDBACK_DNS =
	'https://1b6b3e2bbdc64a73bf45c72b725c56b4@feedback.zextras.tools/8';

export enum ResultLabelType {
	NORMAL = 'normal',
	WARNING = 'warning',
	ERROR = 'error'
}

export const HEADER_BAR_HEIGHT = '3.75rem';
export const PRIMARY_BAR_WIDTH = '3.0625rem';
export const BOARD_HEADER_HEIGHT = '3rem';
export const BOARD_TAB_WIDTH = 'calc(3rem + 15ch)';
export const BOARD_CONTAINER_ZINDEX = 10;
