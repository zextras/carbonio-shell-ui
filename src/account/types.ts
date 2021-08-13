export type AccountState = {
	accounts: Array<Account>;

	fetch: () => Promise<unknown>;
	notify: unknown;

	syncToken: string;

	requestSync: () => Promise<void>;
	verifyAccount: () => Promise<void>;
};
export type Account = {
	id: string;
	name: string;
	displayName: string;
	settings: AccountSettings;
	signatures: { signature: Array<unknown> };
	identities: { identity: Array<unknown> };
};
export type AccountSettings = {
	attrs: Record<string, unknown>;
	prefs: Record<string, unknown>;
	props: Array<ZimletProp>;
};

export type ZimletProp = {
	name: string;
	zimlet: string;
	_content: string;
};
