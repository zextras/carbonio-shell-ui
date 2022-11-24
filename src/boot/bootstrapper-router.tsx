/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	ModalManager,
	ModalManagerContext,
	SnackbarManager,
	SnackbarManagerContext
} from '@zextras/carbonio-design-system';
import React, { FC, useContext, useEffect } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Switch, useHistory, useParams } from 'react-router-dom';
import { useBridge } from '../store/context-bridge';
import AppLoaderMounter from './app/app-loader-mounter';
import { BASENAME, IS_STANDALONE } from '../constants';
import { NotificationPermissionChecker } from '../notification/NotificationPermissionChecker';
import ShellView from '../shell/shell-view';
import { useAppStore } from '../store/app';
import { registerDefaultViews } from './app/default-views';

const ContextBridge: FC = () => {
	const history = useHistory();
	// eslint-disable-next-line @typescript-eslint/ban-types
	const createSnackbar = useContext(SnackbarManagerContext) as Function;
	// eslint-disable-next-line @typescript-eslint/ban-types
	const createModal = useContext(ModalManagerContext) as Function;
	useBridge({
		functions: {
			getHistory: () => history,
			createSnackbar,
			createModal
		}
	});
	return null;
};

const StandaloneListener: FC = () => {
	const { route } = useParams<{ route?: string }>();
	useEffect(() => {
		if (route) useAppStore.setState({ standalone: route });
	}, [route]);
	return null;
};

const DefaultViewsRegister: FC<{ t: TFunction }> = ({ t }) => {
	useEffect(() => {
		registerDefaultViews(t);
	}, [t]);
	return null;
};

const BootstrapperRouter: FC = () => {
	const [t] = useTranslation();
	return (
		<BrowserRouter basename={BASENAME}>
			<SnackbarManager>
				<ModalManager>
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
				</ModalManager>
			</SnackbarManager>
		</BrowserRouter>
	);
};
export default BootstrapperRouter;
