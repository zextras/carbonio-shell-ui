export type Meta<T extends Record<string, unknown>> = {
    section?: string;
    _attrs: T;
};
export type Grant = {
    perm: string;
    gt: 'usr' | 'grp' | 'dom' | 'cos' | 'all' | 'guest' | 'key' | 'pub';
    zid: string;
    expiry?: string;
    d?: string;
    pw?: string;
    key?: string;
};
export type GranteeType = 'usr' | 'grp' | 'egp' | 'all' | 'dom' | 'edom' | 'gst' | 'key' | 'pub' | 'email';
export type Right = 'invite' | 'loginAs' | 'sendAs' | 'sendOnBehalfOf' | 'viewFreeBusy';
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
export type FolderView = 'search folder' | 'tag' | 'conversation' | 'message' | 'contact' | 'document' | 'appointment' | 'virtual conversation' | 'remote folder' | 'wiki' | 'task' | 'chat';
export type SoapPolicy = {
    type?: 'user' | 'system';
    id?: string;
    name?: string;
    lifetime?: string;
};
export type SoapRetentionPolicy = Array<{
    keep: Array<{
        policy: SoapPolicy;
    }>;
    purge: Array<{
        policy: SoapPolicy;
    }>;
}>;
export type BaseFolder = {
    id: string;
    uuid: string;
    name: string;
    absFolderPath?: string;
    l?: string;
    luuid?: string;
    f?: string;
    color?: number;
    rgb?: string;
    u?: number;
    i4u?: number;
    view?: FolderView;
    rev?: number;
    ms?: number;
    md?: number;
    n?: number;
    i4n?: number;
    s?: number;
    i4ms?: number;
    i4next?: number;
    url?: string;
    activesyncdisabled: boolean;
    webOfflineSyncDays?: number;
    perm?: string;
    recursive: boolean;
    rest?: string;
    deletable: boolean;
    meta?: Array<Meta<Record<string, unknown>>>;
    acl?: {
        grant: Array<Grant>;
    };
    retentionPolicy?: SoapRetentionPolicy;
    checked?: boolean;
};
export type LinkFolderFields = {
    owner?: string;
    zid?: string;
    rid?: string;
    ruuid?: string;
    oname?: string;
    reminder: boolean;
    broken: boolean;
};
export type SortBy = 'dateDesc' | 'dateAsc' | 'idDesc' | 'idAsc' | 'subjDesc' | 'subjAsc' | 'nameDesc' | 'nameAsc' | 'durDesc' | 'durAsc' | 'none' | 'taskDueAsc' | 'taskDueDesc' | 'taskStatusAsc' | 'taskStatusDesc' | 'taskPercCompletedAsc' | 'taskPercCompletedDesc' | 'rcptAsc' | 'rcptDesc' | 'readAsc' | 'readDesc';
export type SearchFolderFields = {
    query?: string;
    sortBy?: SortBy;
    types?: string;
};
//# sourceMappingURL=entities.d.ts.map