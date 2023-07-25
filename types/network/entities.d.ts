/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
	gt: 'usr' | 'grp' | 'egp' | 'all' | 'dom' | 'edom' | 'gst' | 'key' | 'pub' | 'email';
	/** Right */
	right: 'viewFreeBusy' | 'invite';
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
