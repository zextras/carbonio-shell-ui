import { string } from 'prop-types';

export type AccountState = {
	account?: Account;
	settings: AccountSettings;
	version: string;
	context: any;
	init: () => Promise<void>;
	soapFetch: <Request, Response>(api: string, body: Request) => Promise<Response>;
	xmlSoapFetch: <Response>(api: string, body: string) => Promise<Response>;
	tags: Array<Tag>;
	components: Array<ZextrasComponent>;
};

export type ZextrasComponent = {
	commit: string;
	display: string;
	// eslint-disable-next-line camelcase
	js_entrypoint: string;
	name: string;
	priority: number;
	version: string;
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
	attrs: Record<string, unknown>;
	prefs: Record<string, unknown>;
	props: Array<ZimletProp>;
};

export type ZimletProp = {
	name: string;
	zimlet: string;
	_content: string;
};

export type ZimletPkgDescription = {
	zimlet: Array<{
		name: string;
		label: string;
		description: string;
		version: string;
		/* Property related to Zextras */ zapp?: 'true';
		/* Property related to Zextras */ 'zapp-main'?: string;
		/* Property related to Zextras */ 'zapp-version'?: string;
		/* Property related to Zextras */ 'zapp-handlers'?: string;
		/* Property related to Zextras */ 'zapp-style'?: string;
		/* Property related to Zextras */ 'zapp-theme'?: string;
		/* Property related to Zextras */ 'zapp-serviceworker-extension'?: string;
	}>;
	zimletContext: Array<{
		baseUrl: string;
		presence: 'enabled';
		priority: number;
	}>;
};

export type GetInfoResponse = {
	name: string;
	id: string;
	attrs: {
		_attrs: {
			displayName: string;
		};
	};
	prefs: {
		_attrs: Record<string, string>;
	};
	signatures: {
		signature: Array<any>;
	};
	identities: {
		identity: Array<any>;
	};
	zimlets: {
		zimlet: Array<ZimletPkgDescription>;
	};
	props: {
		prop: Array<ZimletProp>;
	};
	version: string;
};

export type BasePkgDescription = {
	priority: number;
	package: string;
	name: string;
	description: string;
	version: string;
	resourceUrl: string;
	entryPoint: string;
};

export type AppPkgDescription = BasePkgDescription & {
	swExtension?: string;
	styleEntryPoint?: string;
	handlers?: string;
};

export type SuccessSoapResponse<R> = {
	Body: Record<string, R>;
	Header: any;
};

export type ErrorSoapResponse = {
	Body: {
		Fault: {
			Detail: {
				Error: {
					Code: string;
					Detail: string;
				};
			};
			Reason: {
				Text: string;
			};
		};
	};
	Header: any;
};

export type SoapResponse<R> = SuccessSoapResponse<R> | ErrorSoapResponse;

export type PropsMods = Record<string, { app: string; value: unknown }>;

export type PermissionsMods = {
	freeBusy: any;
	inviteRight: any;
};
export type PrefsMods = Record<string, unknown>;

export type Mods = {
	props?: PropsMods;
	prefs?: PrefsMods;
	permissions?: PermissionsMods;
};
