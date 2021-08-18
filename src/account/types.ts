export type AccountState = {
	accounts: Array<Account>;
	context: any;
	init: () => Promise<void>;
	soapFetch: <Request, Response>(api: string, body: Request) => Promise<Response>;
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
