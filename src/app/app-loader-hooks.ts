import {
	useUserAccounts,
	useCSRFToken,
	useSaveSettingsCallback,
	useCurrentSync,
	useFirstSync,
	useFiberChannel,
	getUseAddBoardCallback,
	useUpdateCurrentBoard,
	useRemoveCurrentBoard,
	useBoardConfig,
	getUsePushHistoryCallback,
	useGoBackHistoryCallback,
	getUseReplaceHistoryCallback,
	useIsMobile
} from '../shell/hooks';
import {
	useApp,
	useAppContext,
	useIntegratedHook,
	useIntegratedFunction,
	useIntegratedAction,
	useIntegratedActionsByType,
	useIntegratedComponent
} from '../app-store/hooks';

export const getAppHooks = (pkg: string): unknown => ({
	// The returned function is a hook
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useAppContext: useAppContext(pkg),
	// The returned function is a hook
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useApp: useApp(pkg),
	useIntegratedHook,
	useIntegratedFunction,
	useIntegratedAction,
	useIntegratedComponent,
	useIntegratedActionsByType,
	useUserAccounts,
	useCSRFToken,
	useSaveSettingsCallback,
	useCurrentSync,
	useFirstSync,
	useFiberChannel,
	useAddBoardCallback: getUseAddBoardCallback(pkg),
	useUpdateCurrentBoard,
	useRemoveCurrentBoard,
	useBoardConfig,
	usePushHistoryCallback: getUsePushHistoryCallback(pkg),
	useGoBackHistoryCallback,
	useReplaceHistoryCallback: getUseReplaceHistoryCallback(pkg),
	useIsMobile
});
