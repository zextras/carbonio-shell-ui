/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2019 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export type ISoapNotification = {
	seq: number;
	deleted?: IDeletedNotification;
	// /* List of ids, comma separated */ id: string;
	created?: INotification<string, any>;
	// folder: Array<IFolderCreatedNotification>;
	// m?: Array<IMessageCreatedNotification>;
	modified?: INotification<string, any>;
	// /* Conversations */ c?: Array<IConvModifiedNotification>;
	// folder?: Array<IFolderModifiedNotification>;
	// /* Messages */ m?: Array<IMessageModifiedNotification>;
};

export type IDeletedNotification = {
	id: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type INotification<TAG extends string, T> = {
	[tag in TAG]: Array<T>;
};

// const p: INotification<'asd', {}> = {
// 	asd: [{}],
// };
//
// export interface  IConvModifiedNotification extends IModifiedNotification {
// 	id: string;
// 	f: '' | /* Marked as undread */ 'sru' | /* Marked as read */ 'sr';
// 	/* Number of unread messages */ u: number;
// }
//
// export interface IFolderCreatedNotification extends ICreatedNotification {
// 	absFolderPath: string;
// 	activesyncdisabled: boolean;
// 	deletable: boolean;
// 	i4ms: number;
// 	i4next: number;
// 	id: string;
// 	l: string;
// 	luuid: string;
// 	ms: number;
// 	n: number;
// 	name: string;
// 	rev: number;
// 	s: number;
// 	uuid: string;
// 	view: string;
// 	webOfflineSyncDays: number;
// }
//
// export interface  IFolderModifiedNotification extends IModifiedNotification {
// 	deletable: boolean;
// 	i4ms: number;
// 	i4next: number;
// 	id: string;
// 	/* Number of messages */ n: number;
// 	s: number;
// 	/* Number of unread messages */ u: number;
// 	uuid: string;
// }
//
// export interface IMessageCreatedNotification extends ICreatedNotification {
// 	cid: string;
// 	d: number;
// 	/* Email addresses */ e: Array<IEmailAddresses>;
// 	f: 'u';
// 	/* A fragment of the message */ fr: string;
// 	id: string;
// 	l: string;
// 	rev: number;
// 	s: number;
// 	/* Subject */ su: string;
// }
//
// export interface  IMessageModifiedNotification extends IModifiedNotification {
// 	l: string;
// 	f: /* Marked as read */ '' | /* Marked as unread */ 'u';
// 	id: string;
// }

export type IEmailAddresses = {
	/* user@domain part of the mail address */
	a?: string;
	/* Display name */
	d?: string;
	/* Comment/ Name */
	p?: string;
	/* Type */
	t?:
	/* from */ 'f'
		| /* to */ 't'
		| /* cc */ 'c'
		| /* bcc */ 'b'
		| /* reply-to */ 'r'
		| /* sender */ 's'
		| /* read-receipt notifications */ 'n'
		| /* resent-from */ 'rf';
};
