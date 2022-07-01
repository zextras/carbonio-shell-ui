/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Store } from '@reduxjs/toolkit';
import { To } from 'history';
import { ComponentType } from 'react';
import { CarbonioModule, PanelMode } from '../apps';

// eslint-disable-next-line no-shadow
export enum JSNS {
	ACCOUNT = 'urn:zimbraAccount',
	ADMIN = 'urn:zimbraAdmin',
	MAIL = 'urn:zimbraMail',
	ALL = 'urn:zimbra',
	SYNC = 'urn:zimbraSync'
}

export type DRPropValues = 'auto' | 'enabled' | 'disabled';

// eslint-disable-next-line @typescript-eslint/ban-types
export type PackageDependentFunction = (app: string) => Function;
// eslint-disable-next-line @typescript-eslint/ban-types

export type ContextBridgeState = {
	packageDependentFunctions: Record<string, PackageDependentFunction>;
	// eslint-disable-next-line @typescript-eslint/ban-types
	functions: Record<string, Function>;
	add: (content: Partial<Omit<ContextBridgeState, 'add'>>) => void;
};

export type IShellWindow = Window & {
	__ZAPP_SHARED_LIBRARIES__: { [name: string]: any };
	__ZAPP_HMR_EXPORT__: { [pkgName: string]: (appClass: ComponentType) => void };
	// __ZAPP_HMR_HANDLERS__: { [pkgName: string]: (handlers: RequestHandlersList) => void };
};

export type LoadedAppRuntime = AppInjections & {
	pkg: CarbonioModule;
};

export type LoadedAppsCache = {
	[pkgName: string]: LoadedAppRuntime;
};

export type AppInjections = {
	store: Store<any>;
};

export type HistoryParams =
	| {
			path: To;
			route?: string;
	  }
	| string;
export type UtilityBarStore = {
	mode: PanelMode;
	setMode: (mode: PanelMode) => void;
	current?: string;
	setCurrent: (current: string) => void;
	secondaryBarState: boolean;
	setSecondaryBarState: (state: boolean) => void;
};

export type AccountProps = {
	accountId?: string;
	type?: string;
	id?: number;
	email?: string;
	label?: string;
	personaLabel?: string;
	identityId?: string;
};

export type IdentityProps = {
	id: string;
	type: string;
	identityId: string | number;
	fromAddress?: string;
	identityName?: string;
	fromDisplay?: string;
	recoveryAccount?: string;
	replyToDisplay?: string;
	replyToAddress?: string;
	replyToEnabled?: string;
	saveToSent?: string;
	sentMailFolder?: string;
	whenInFoldersEnabled?: string;
	whenSentToEnabled?: string;
	whenSentToAddresses?: string;
};

export type CreateModalProps = {
	background: string;
	centered: boolean;
	children: React.ReactElement;
	confirmColor: string;
	confirmLabel: string;
	copyLabel: string;
	customFooter: React.ReactElement;
	disablePortal: boolean;
	dismissLabel: string;
	hideFooter: boolean;
	maxHeight: string;
	onClose: () => void;
	onConfirm: () => void;
	onSecondaryAction: () => void;
	optionalFooter: React.ReactElement;
	secondaryActionLabel: string;
	showCloseIcon: boolean;
	size: string;
	title: string;
	type: string;
	zIndex: number;
};

// Custom metadata
type Meta<T extends Record<string, unknown>> = {
	// Section. Normally present. If absent this indicates that CustomMetadata info is present but there are no sections to report on.
	section?: string;
	_attrs: T;
};
// Grants
type Grant = {
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
	// Name or email address of the principal being granted rights. optional if {grantee-type} is "all"/"guest"/"pub". When specified in a request, this can be just the username portion of the address in the default domain.
	d?: string;
	// Optional argument. password when {grantee-type} is "guest"
	pw?: string;
	// Optional argument. Access key when {grantee-type} is "key"
	key?: string;
};
export type SoapPolicy = {
	// Retention policy type
	type?: 'user' | 'system';
	id?: string;
	name?: string;
	lifetime?: string;
};

export type SoapRetentionPolicy = Array<{
	keep: Array<SoapPolicy>;
	purge: Array<SoapPolicy>;
}>;

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
	color?: string;
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
	meta?: Array<Meta>;
	// ACL for sharing
	acl?: { grant: Array<Grant> };
	retentionPolicy?: SoapRetentionPolicy;
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
export type SearchFolderFields = {
	// Query
	query?: string;
	// Sort by
	sortBy?: SortBy;
	// Comma-separated list. Legal values in list are:
	// appointment|chat|contact|conversation|document|message|tag|task|wiki (default is "conversation")
	types?: string;
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

export type AccordionFolder = {
	id: string;
	label: string;
	folder: Folder;
	CustomComponent: ComponentType<{ folder: Folder }>;
	items: Array<AccordionFolder>;
};

export type TreeNode<T> = T & {
	id: string;
	children: TreeNode<T>[];
	parent?: TreeNode<T>;
};
