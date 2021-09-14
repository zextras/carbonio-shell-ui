import { SoapFetch, ZimletProp } from '../network';

export type AccountState = {
	account?: Account;
	settings: AccountSettings;
	zimbraVersion: string;
	context: AccountContext;
	init: () => Promise<void>;
	setContext: (context: unknown) => void;
	xmlSoapFetch: (app: string) => SoapFetch;
	soapFetch: (app: string) => SoapFetch;
	tags: Array<Tag>;
};

export type AccountContext = {
	refresh?: NotifyObject;
	notify?: NotifyObject;
	change?: { token: number };
	session?: { id: number; _content: number };
};

export type NotifyObject = {
	seq?: number;
	version?: string;
	mbx?: [{ s: number }];
	folder?: Array<unknown>;
};

export type ZextrasModule = {
	commit: string;
	display: string;
	// eslint-disable-next-line camelcase
	js_entrypoint: string;
	name: string;
	priority: number;
	version: string;
	route: string;
};

export type Account = {
	// apps: Array<AppPkgDescription>;
	id: string;
	name: string;
	displayName: string;
	//	settings: AccountSettings;
	signatures: { signature: Array<unknown> };
	identities: { identity: Array<unknown> };
};

export type Tag = {
	color?: string;
	id: string;
	name: string;
	rgb?: string;
};
export type AccountSettings = {
	attrs: Record<string, string | number>;
	prefs: Record<string, string | number>;
	props: Array<ZimletProp>;
};