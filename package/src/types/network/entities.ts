/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// Custom metadata
export type Meta<T extends Record<string, unknown>> = {
	// Section. Normally present. If absent this indicates that CustomMetadata info is present but there are no sections to report on.
	section?: string;
	_attrs: T;
};

// Grants
export type Grant = {
	// Rights - Some combination of (r)ead, (w)rite, (i)nsert, (d)elete, (a)dminister, workflow action (x), view (p)rivate, view (f)reebusy, (c)reate subfolder
	perm: string;
	/* The type of Grantee:
	"usr",
	"grp",
	"dom" (domain),
	"cos",
	"all" (all authenticated users),
	"pub" (public authenticated and unauthenticated access),
	"guest" (non-Zimbra email address and password),
	"key" (non-Zimbra email address and access key)
	*/
	gt: 'usr' | 'grp' | 'dom' | 'cos' | 'all' | 'guest' | 'key' | 'pub';
	// Grantee ID
	zid: string;
	// Time when this grant expires. For internal/guest grant: If this attribute is not specified, the expiry of the grant is derived from internalGrantExpiry/guestGrantExpiry of the ACL it is part of. If this attribute is specified (overridden), the expiry value can not be greater than the corresponding expiry value in the ACL. For public grant: If this attribute is not specified, defaults to the maximum allowed expiry for a public grant. If not specified in the response, defaults to 0. Value of 0 indicates that this grant never expires.
	expiry?: string;
	// Name or email address of the principal being granted rights. optional if \{grantee-type\} is "all"/"guest"/"pub". When specified in a request, this can be just the username portion of the address in the default domain.
	d?: string;
	// Optional argument. password when \{grantee-type\} is "guest"
	pw?: string;
	// Optional argument. Access key when \{grantee-type\} is "key"
	key?: string;
};

// The type of grantee:
export type GranteeType =
	// usr - Zimbra user
	| 'usr'
	// grp - Zimbra group(distribution list)
	| 'grp'
	// an external AD group
	| 'egp'
	// all - all authenticated users
	| 'all'
	// Zimbra Domain
	| 'dom'
	// non-Zimbra domain (used with sendToDistList right)
	| 'edom'
	// gst - non-Zimbra email address and password (not yet supported)
	| 'gst'
	// key - external user with an accesskey
	| 'key'
	// pub - public authenticated and unauthenticated access
	| 'pub'
	// Pseudo grantee type.  Granting code will map to usr/grp/egp or gst
	| 'email';

export type Right =
	// Following rights are partial, they are the result of
	// description: automatically add meeting invites from grantee to the target's calendar
	// right type: preset
	// target type(s): account
	// grant target type: (default)
	// right class: USER
	| 'invite'
	// description: login as another user.  Currently this is only honored for imap/pop3 login.
	// right type: preset
	// target type(s): account
	// grant target type: (default)
	// right class: USER
	| 'loginAs'
	// description: reply to messages in a shared folder as the owner of the folder
	// right type: preset
	// target type(s): account
	// grant target type: account
	// right class: USER
	| 'sendAs'
	// description: send messages on behalf of the grantor
	// right type: preset
	// target type(s): account
	// grant target type: account
	// right class: USER
	| 'sendOnBehalfOf'
	// description: view free/busy
	// right type: preset
	// target type(s): account
	// grant target type: (default)
	// right class: USER
	| 'viewFreeBusy';

/** Specify Access Control Entries */
export interface AccountACEInfo {
	/** Zimbra ID of the grantee */
	zid?: string;
	/**
	 * The type of grantee:
	 *        usr - Zimbra user
	 *    grp - Zimbra group(distribution list)
	 *    all - all authenticated users
	 *    gst - non-Zimbra email address and password (not yet supported)
	 *    key - external user with an accesskey
	 *    pub - public authenticated and unauthenticated access
	 *    If the value is:
	 *        usr - either \{zimbra-id\} or \{grantee-name\} is required
	 * grp - either \{zimbra-id\} or \{grantee-name\} is required
	 * all - \{zimbra-id\}, \{grantee-name\} and \{password\} are ignored
	 * gst - \{zimbra-id\} is ignored, \{grantee-name\} is required, \{password\} is optional
	 * key - \{zimbra-id\} is ignored, \{grantee-name\} is required
	 * pub - \{zimbra-id\}, \{grantee-name\} and \{password\} are ignored
	 * For usr and grp:
	 *    if \{zimbra-id\} is provided, server will lookup the entry by \{zimbra-id\} and
	 * if \{zimbra-id\} is not provided, server will lookup the grantee by \{grantee-type\} and \{grantee-name\}
	 * if the lookup fails, NO_SUCH_ACCOUNT/NO_SUCH_DISTRIBUTION_LIST will be thrown.
	 *    If \{grantee-type\} == key:
	 *    if key is given, server will use that as the access key for this grant
	 * if key is not given, server will generate an access key
	 * If chkgt is "1 (true)", INVALID_REQUEST will be thrown if wrong grantee type is specified.
	 */
	gt: GranteeType;
	/** Right */
	right: Right;
	/**
	 * Name or email address of the grantee.
	 * Not present if \{grantee-type\} is "all" or "pub"
	 */
	d?: string;
	/** Optional access key when \{grantee-type\} is "key" */
	key?: string;
	/** Password when \{grantee-type\} is "gst" (not yet supported) */
	pw?: string;
	/** "1" if a right is specifically denied or "0" (default) */
	deny?: boolean;
	/** "1 (true)" if check grantee type or "0 (false)" (default) */
	chkgt?: boolean;
}

export type FolderView =
	| 'search folder'
	| 'tag'
	| 'conversation'
	| 'message'
	| 'contact'
	| 'document'
	| 'appointment'
	| 'virtual conversation'
	| 'remote folder'
	| 'wiki'
	| 'task'
	| 'chat';

export type SoapPolicy = {
	// Retention policy type
	type?: 'user' | 'system';
	id?: string;
	name?: string;
	lifetime?: string;
};

export type SoapRetentionPolicy = Array<{
	keep: Array<{ policy: SoapPolicy }>;
	purge: Array<{ policy: SoapPolicy }>;
}>;

export type BaseFolder = {
	// Folder ID
	id: string;
	// Item's UUID - a globally unique identifier
	uuid: string;
	// Name of folder; max length 128; whitespace is trimmed by server; Cannot contain ':', '"', '/', or any character below 0x20
	name: string;
	// Absolute Folder path
	absFolderPath?: string;
	// ID of parent folder (absent for root folder)
	l?: string;
	// UUID of parent folder (absent for root folder)
	luuid?: string;
	// Flags - checked in UI (#), exclude free/(b)usy info, IMAP subscribed (*), does not (i)nherit rights from parent, is a s(y)nc folder with external data source, sync is turned on(~), folder does n(o)t allow inferiors / children
	f?: string;
	// color numeric; range 0-127; defaults to 0 if not present; client can display only 0-7
	color?: number;
	// RGB color in format #rrggbb where r,g and b are hex digits
	rgb?: string;
	// Number of unread messages in folder
	u?: number;
	// Number of unread messages with this tag, including those with the IMAP \Deleted flag set
	i4u?: number;
	// (optional) Default type for the folder; used by web client to decide which view to use;
	view?: FolderView;
	// Revision
	rev?: number;
	// Modified sequence
	ms?: number;
	// Modified date in seconds
	md?: number;
	// Number of non-subfolder items in folder
	n?: number;
	// Number of non-subfolder items in folder, including those with the IMAP \Deleted flag set
	i4n?: number;
	// Total size of all of non-subfolder items in folder
	s?: number;
	// Imap modified sequence
	i4ms?: number;
	// IMAP UIDNEXT
	i4next?: number;
	// URL (RSS, iCal, etc.) this folder syncs its contents to
	url?: string;
	activesyncdisabled: boolean;
	// Number of days for which web client would sync folder data for offline use
	webOfflineSyncDays?: number;
	// For remote folders, the access rights the authenticated user has on the folder - will contain the calculated (c)reate folder permission if the user has both (i)nsert and (r)ead access on the folder
	perm?: string;
	// recursive
	recursive: boolean;
	// URL to the folder in the REST interface for rest-enabled apps (such as notebook)
	rest?: string;
	// whether this folder can be deleted
	deletable: boolean;
	// custom metadata
	meta?: Array<Meta<Record<string, unknown>>>;
	// ACL for sharing
	acl?: { grant: Array<Grant> };
	retentionPolicy?: SoapRetentionPolicy;
	// indicates whether this folder is displayed in Calendars
	checked?: boolean;
};

export type LinkFolderFields = {
	// Primary email address of the owner of the linked-to resource
	owner?: string;
	// Zimbra ID (guid) of the owner of the linked-to resource
	zid?: string;
	// Item ID of the linked-to resource in the remote mailbox
	rid?: string;
	// UUID of the linked-to resource in the remote mailbox
	ruuid?: string;
	// The name presently used for the item by the owner
	oname?: string;
	// If set, client should display reminders for shared appointments/tasks
	reminder: boolean;
	// If "tr" is true in the request, broken is set if this is a broken link
	broken: boolean;
};

export type SortBy =
	| 'dateDesc'
	| 'dateAsc'
	| 'idDesc'
	| 'idAsc'
	| 'subjDesc'
	| 'subjAsc'
	| 'nameDesc'
	| 'nameAsc'
	| 'durDesc'
	| 'durAsc'
	| 'none'
	| 'taskDueAsc'
	| 'taskDueDesc'
	| 'taskStatusAsc'
	| 'taskStatusDesc'
	| 'taskPercCompletedAsc'
	| 'taskPercCompletedDesc'
	| 'rcptAsc'
	| 'rcptDesc'
	| 'readAsc'
	| 'readDesc';

export type SearchFolderFields = {
	// Query
	query?: string;
	// Sort by
	sortBy?: SortBy;
	// Comma-separated list. Legal values in list are:
	// appointment|chat|contact|conversation|document|message|tag|task|wiki (default is "conversation")
	types?: string;
};
