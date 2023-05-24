/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	Modal,
	ModalManagerContext,
	Padding,
	SnackbarManagerContext,
	Text
} from '@zextras/carbonio-design-system';
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import { find } from 'lodash';
import { useBridge } from '../store/context-bridge';
import AppLoaderMounter from './app/app-loader-mounter';
import { IS_STANDALONE } from '../constants';
import { NotificationPermissionChecker } from '../notification/NotificationPermissionChecker';
import ShellView from '../shell/shell-view';
import { useAppStore } from '../store/app';
import { registerDefaultViews } from './app/default-views';
import { getInfo } from '../network/get-info';
import { loadApps, unloadAllApps } from './app/load-apps';
import { loginConfig } from '../network/login-config';
import { goToLogin } from '../network/go-to-login';
import { getComponents } from '../network/get-components';

const ContextBridge: FC = () => {
	const history = useHistory();
	const createSnackbar = useContext(SnackbarManagerContext);
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

export function isPromiseRejectedResult<T>(
	promiseSettledResult: PromiseSettledResult<T>
): promiseSettledResult is PromiseRejectedResult {
	return promiseSettledResult.status === 'rejected';
}

type LoaderFailureModalProps = { open: boolean; closeHandler: () => void };

export const LoaderFailureModal = ({
	open,
	closeHandler
}: LoaderFailureModalProps): JSX.Element => {
	const [t] = useTranslation();
	const onConfirm = useCallback(() => window.location.reload(), []);
	return (
		<Modal
			open={open}
			showCloseIcon={false}
			onSecondaryAction={goToLogin}
			title={t('bootstrap.failure.modal.title', 'Something went wrong...')}
			confirmLabel={t('bootstrap.failure.modal.confirmButtonLabel', 'refresh')}
			secondaryActionLabel={t('bootstrap.failure.modal.secondaryButtonLabel', 'login page')}
			onConfirm={onConfirm}
			onClose={closeHandler}
		>
			<Padding all="small">
				<Text overflow="break-word">
					{t(
						'bootstrap.failure.modal.body',
						'Some technical issues occurred while processing your request. Please try to refresh the page or go back to the login page.'
					)}
				</Text>
			</Padding>
		</Modal>
	);
};

const Loader: FC = () => {
	const [open, setOpen] = useState(false);
	const closeHandler = useCallback(() => setOpen(false), []);

	useEffect(() => {
		Promise.allSettled([loginConfig(), getComponents(), getInfo()])
			.then((promiseSettledResultArray) => {
				const promiseRejectedResult = find(promiseSettledResultArray, isPromiseRejectedResult);
				if (promiseRejectedResult) {
					console.error(promiseRejectedResult.reason);
					setOpen(true);
				}
			})
			.finally(() => {
				loadApps(Object.values(useAppStore.getState().apps));
			});
		return () => {
			unloadAllApps();
		};
	}, []);
	return <LoaderFailureModal open={open} closeHandler={closeHandler} />;
};

const BootstrapperRouter: FC = () => {
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
