export const ui: any;

export const testUtils: {
	render(
		// eslint-disable-next-line no-shadow
		ui: React.ReactElement,
		options?: Omit<RenderOptions, 'queries'>
	): RenderResult;
};

// shell runtime exports
export const store: {
	store: Store<any>;
	setReducer(nextReducer: Reducer): void;
};
export const registerAppData: (data: RuntimeAppData) => void;
export const setAppContext: <T>(obj: T) => void;
export const soapFetch: SoapFetch;
export const Applink: FunctionComponent<LinkProps>;
export const Spinner: FunctionComponent;
export const List: FunctionComponent<ListProps<any>>;

export const getApp: () => AppData;
export const getAppContext: <T>() => T;
export const getBridgedFunctions: () => {
	addBoard: (path: string, context?: unknown | { app: string }) => void;
	createModal: (...params: any[]) => void;
	createSnackbar: (...params: any[]) => void;
	getAccounts: () => Array<Account>;
	getHistory: () => History;
	historyGoBack: () => void;
	historyPush: (location: LocationDescriptor) => void;
	historyReplace: (location: LocationDescriptor) => void;
	removeBoard: (key: string) => void;
	removeCurrentBoard: () => void;
	setCurrentBoard: (key: string) => void;
	updateBoard: (key: string, url: string, title: string) => void;
	updateCurrentBoard: (url: string, title: string) => void;
};
export const getIntegratedAction: (id: string) => [SharedAction | undefined, boolean];
export const getIntegratedActionsByType: (type: string) => Array<SharedAction>;
// eslint-disable-next-line @typescript-eslint/ban-types
export const getIntegratedFunction: (id: string) => [Function, boolean];
// eslint-disable-next-line @typescript-eslint/ban-types
export const getIntegratedHook: (id: string) => [Function, boolean];

export const useAddBoardCallback: () => (path: string, context?: unknown | { app: string }) => void;
export const useApp: () => AppData;
export const useAppContext: <T>() => T;
export const useBehaviorSubject: <T>(observable: BehaviorSubject<T>) => T;
export const useBoardConfig: <T>() => T;
export const useCSRFToken: () => string;
export const useCurrentSync: () => any;
export const useFirstSync: () => any;
export const useGoBackHistoryCallback: () => () => void;
export const useIsMobile: () => boolean;
export const usePromise: () => any;
export const usePushHistoryCallback: () => (location: LocationDescriptor) => void;
export const useRemoveCurrentBoard: () => () => void;
export const useReplaceHistoryCallback: () => (location: LocationDescriptor) => void;
export const useSaveSettingsCallback: () => (mods: {
	props: Record<string, { value: any; app: string }>;
	prefs: Record<string, any>;
}) => void;
export const useUpdateCurrentBoard: () => (url: string, title: string) => void;
export const useUserAccounts: () => Account[];

// it's an eslint bug
// eslint-disable-next-line no-shadow
export const ZIMBRA_STANDARD_COLORS: Array<{ zValue: number; hex: string; zLabel: string }>;

// it's an eslint bug
// eslint-disable-next-line no-shadow
export enum FOLDERS {
	USER_ROOT = '1',
	INBOX = '2',
	TRASH = '3',
	SPAM = '4',
	SENT = '5',
	DRAFTS = '6',
	CONTACTS = '7',
	TAGS = '8',
	CONVERSATIONS = '9',
	CALENDAR = '10',
	ROOT = '11',
	NOTEBOOK = '12', // no longer created in new mailboxes since Helix (bug 39647).  old mailboxes may still contain a system folder with id 12
	AUTO_CONTACTS = '13',
	IM_LOGS = '14',
	TASKS = '15',
	BRIEFCASE = '16'
}
export const registerActions: (
	...items: Array<{ id: string; action: ActionFactory<unknown>; type: string }>
) => void;
export const registerComponents: (...items: Array<{ id: string; component: Component }>) => void;
export const registerHooks: (...items: Array<{ id: string; hook: AnyFunction }>) => void;
export const registerFunctions: (...items: Array<{ id: string; fn: AnyFunction }>) => void;

export type Action = {
	id: string;
	label: string;
	icon: string;
	click: (ev: unknown) => void;
	type: string;
	primary?: boolean;
	group?: string;
	disabled?: boolean;
	[key: string]: unknown;
};

export const getIntegratedComponent: (id: string) => [FunctionComponent<unknown>, boolean];
export const getActions: <T>(target: T, type: string) => Array<Action>;
export const getActionsFactory: (type: string) => <T>(target: T) => Array<Action>;
export const getAction: <T>(type: string, id: string, target?: T) => [Action | undefined, boolean];
export const getFactory: <T>(type: string, id: string) => [ActionFactory<T> | undefined, boolean];
export const useIntegratedHook: (id: string) => [AnyFunction, boolean];
export const useIntegratedFunction: (id: string) => [AnyFunction, boolean];
export const useIntegratedComponent: (id: string) => [FunctionComponent<unknown>, boolean];
export const useActions: <T>(target: T, type: string) => Array<Action>;
export const useActionsFactory: <T>(type: string) => CombinedActionFactory<T>;
export const useAction: <T>(type: string, id: string, target?: T) => [Action | undefined, boolean];
export const useActionFactory: <T>(
	type: string,
	id: string
) => [ActionFactory<T> | undefined, boolean];
