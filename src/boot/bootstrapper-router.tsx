/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ModalManagerContext, SnackbarManagerContext } from '@zextras/carbonio-design-system';
import React, { useContext, useEffect } from 'react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import { useBridge } from '../store/context-bridge';
import AppLoaderMounter from './app/app-loader-mounter';
import { IS_STANDALONE } from '../constants';
import { NotificationPermissionChecker } from '../notification/NotificationPermissionChecker';
import ShellView from '../shell/shell-view';
import { useAppStore } from '../store/app';
import { registerDefaultViews } from './app/default-views';
import { Loader } from './loader';

const ContextBridge = (): null => {
	const history = useHistory();
	const createSnackbar = useSnackbar();
	const createModal = useContext(ModalManagerContext);
	useBridge({
		functions: {
			getHistory: () => history,
			createSnackbar,
			createModal
		}
	});
	return null;
};

const StandaloneListener = (): null => {
	const { route } = useParams<{ route?: string }>();
	useEffect(() => {
		if (route) useAppStore.setState({ standalone: route });
	}, [route]);
	return null;
};

type DefaultViewsRegisterProps = { t: TFunction };

const DefaultViewsRegister = ({ t }: DefaultViewsRegisterProps): null => {
	useEffect(() => {
		registerDefaultViews(t);
	}, [t]);
	return null;
};

const BootstrapperRouter = (): JSX.Element => {
	const [t] = useTranslation();

	return (
		<>
			<Loader />
			{IS_STANDALONE && (
				<Switch>
					<Route path={'/:route'}>
						<StandaloneListener />
					</Route>
				</Switch>
			)}
			<DefaultViewsRegister t={t} />
			<NotificationPermissionChecker />
			<ContextBridge />
			<AppLoaderMounter />
			<ShellView />
		</>
	);
};
export default BootstrapperRouter;
