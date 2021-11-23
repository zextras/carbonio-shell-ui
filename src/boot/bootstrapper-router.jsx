import React, { useContext, Suspense, lazy } from 'react';
import { BrowserRouter, useHistory } from 'react-router-dom';
import { SnackbarManagerContext, ModalManagerContext } from '@zextras/zapp-ui';
import AppLoaderMounter from './app/app-loader-mounter';
import { useContextBridge } from '../store/context-bridge';
import LoadingView from './loading-view';

export const LazyShellView = lazy(() =>
	import(/* webpackChunkName: "shell-view" */ '../shell/shell-view')
);

const ContextBridge = () => {
	const history = useHistory();
	const createSnackbar = useContext(SnackbarManagerContext);
	const createModal = useContext(ModalManagerContext);
	useContextBridge({
		functions: {
			getHistory: () => history,
			createSnackbar,
			createModal,
			historyGoBack: () => history.goBack()
		},
		routeDependentFunctions: {
			historyPush: (route) => (location) => {
				if (typeof location === 'string') {
					history.replace(`/${route}${location}`);
				} else {
					history.replace({ ...location, pathname: `/${route}${location.pathname}` });
				}
			},
			historyReplace: (route) => (location) => {
				if (typeof location === 'string') {
					history.replace(`/${route}${location}`);
				} else {
					history.replace({ ...location, pathname: `/${route}${location.pathname}` });
				}
			}
		}
	});
	return null;
};

export default function BootstrapperRouter() {
	return (
		<BrowserRouter basename={BASE_PATH}>
			<ContextBridge />
			<AppLoaderMounter />
			<Suspense fallback={<LoadingView />}>
				<LazyShellView />
			</Suspense>
		</BrowserRouter>
	);
}
