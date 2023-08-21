/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
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
	 *        usr - either {zimbra-id} or {grantee-name} is required
	 * grp - either {zimbra-id} or {grantee-name} is required
	 * all - {zimbra-id}, {grantee-name} and {password} are ignored
	 * gst - {zimbra-id} is ignored, {grantee-name} is required, {password} is optional
	 * key - {zimbra-id} is ignored, {grantee-name} is required
	 * pub - {zimbra-id}, {grantee-name} and {password} are ignored
	 * For usr and grp:
	 *    if {zimbra-id} is provided, server will lookup the entry by {zimbra-id} and
	 * if {zimbra-id} is not provided, server will lookup the grantee by {grantee-type} and {grantee-name}
	 * if the lookup fails, NO_SUCH_ACCOUNT/NO_SUCH_DISTRIBUTION_LIST will be thrown.
	 *    If {grantee-type} == key:
	 *    if key is given, server will use that as the access key for this grant
	 * if key is not given, server will generate an access key
	 * If chkgt is "1 (true)", INVALID_REQUEST will be thrown if wrong grantee type is specified.
	 */
	gt: GranteeType;
	/** Right */
	right: Right;
	/**
	 * Name or email address of the grantee.
	 * Not present if {grantee-type} is "all" or "pub"
	 */
	d?: string;
	/** Optional access key when {grantee-type} is "key" */
	key?: string;
	/** Password when {grantee-type} is "gst" (not yet supported) */
	pw?: string;
	/** "1" if a right is specifically denied or "0" (default) */
	deny?: boolean;
	/** "1 (true)" if check grantee type or "0 (false)" (default) */
	chkgt?: boolean;
}
