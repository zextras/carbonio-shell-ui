/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act, screen, within } from '@testing-library/react';
import { Button, Text } from '@zextras/carbonio-design-system';
import { produce } from 'immer';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';

import AppViewContainer from './app-view-container';
import ShellPrimaryBar from './shell-primary-bar';
import { AccountState, PrimaryBarView } from '../../types';
import { DefaultViewsRegister } from '../boot/bootstrapper';
import { usePushHistoryCallback } from '../history/hooks';
import { ModuleSelector } from '../search/module-selector';
import { useAccountStore } from '../store/account';
import { useAppStore } from '../store/app';
import { ICONS } from '../test/constants';
import { setup } from '../test/utils';

const ShellWrapper = (): React.JSX.Element => (
	<>
		<DefaultViewsRegister />
		<ModuleSelector />
		<ShellPrimaryBar />
		<AppViewContainer />
	</>
);

const AboutView = (): React.JSX.Element | null => {
	const { view } = useParams<{ view: string }>();
	return (
		<div>
			<Text>{view}</Text>
		</div>
	);
};

const MailsView = (): React.JSX.Element => {
	const { path } = useRouteMatch();
	const push = usePushHistoryCallback();

	return (
		<Switch>
			<Route path={`${path}/:view`}>
				<AboutView />
			</Route>
			<Route path={`${path}/`}>
				<Text>default mails view</Text>
				<Button
					label={'navigate to about'}
					onClick={(): void => push({ route: 'mails', path: 'about' })}
				/>
			</Route>
		</Switch>
	);
};

const FilesView = (): React.JSX.Element => (
	<div>
		<Text>files view</Text>
	</div>
);

describe('Shell primary bar', () => {
	test('Show a component for each primary bar view registered in the store', () => {
		const primaryBarViews: PrimaryBarView[] = [
			{
				id: 'pbv-1',
				app: 'app1',
				label: 'App One',
				route: 'app1',
				position: 1,
				badge: { show: false },
				visible: true,
				component: 'People'
			},
			{
				id: 'pbv-2',
				app: 'app2',
				label: 'App Two',
				route: 'app2',
				position: 2,
				badge: { show: false },
				visible: true,
				component: 'Activity'
			}
		];
		useAppStore.setState((state) => ({
			views: { ...state.views, primaryBar: primaryBarViews }
		}));
		const { getByRoleWithIcon } = setup(<ShellPrimaryBar />);
		expect(getByRoleWithIcon('button', { icon: 'People' })).toBeVisible();
		expect(getByRoleWithIcon('button', { icon: 'People' })).toBeEnabled();
		expect(getByRoleWithIcon('button', { icon: 'Activity' })).toBeVisible();
		expect(getByRoleWithIcon('button', { icon: 'Activity' })).toBeEnabled();
	});

	test('Primary bar view set as not visible are not shown', () => {
		const primaryBarViews: PrimaryBarView[] = [
			{
				id: 'pbv-1',
				app: 'app1',
				label: 'App One',
				route: 'app1',
				position: 1,
				badge: { show: false },
				visible: true,
				component: 'People'
			},
			{
				id: 'pbv-2',
				app: 'app2',
				label: 'App Two',
				route: 'app2',
				position: 2,
				badge: { show: false },
				visible: false,
				component: 'Activity'
			}
		];
		useAppStore.setState((state) => ({
			views: { ...state.views, primaryBar: primaryBarViews }
		}));
		const { getByRoleWithIcon, queryByRoleWithIcon } = setup(<ShellPrimaryBar />);
		expect(getByRoleWithIcon('button', { icon: 'People' })).toBeVisible();
		expect(getByRoleWithIcon('button', { icon: 'People' })).toBeEnabled();
		expect(queryByRoleWithIcon('button', { icon: 'Activity' })).not.toBeInTheDocument();
	});

	test('When return to a visited module, the last visited view is preserved', async () => {
		const { getByRoleWithIcon, user } = setup(<ShellWrapper />);

		act(() => {
			useAppStore.getState().setters.setApps([
				{
					commit: '',
					description: 'Mails module',
					display: 'Mails',
					icon: 'MailModOutline',
					js_entrypoint: '',
					name: 'carbonio-mails-ui',
					priority: 1,
					type: 'carbonio',
					version: '0.0.1'
				},
				{
					commit: '',
					description: 'Files module',
					display: 'Files',
					icon: 'DriveOutline',
					js_entrypoint: '',
					name: 'carbonio-files-ui',
					priority: 2,
					type: 'carbonio',
					version: '0.0.1'
				}
			]);
			useAppStore.getState().setters.addRoute({
				id: 'mails',
				route: 'mails',
				position: 1,
				visible: true,
				label: 'Mails',
				primaryBar: 'MailModOutline',
				appView: MailsView,
				badge: { show: false },
				app: 'carbonio-mails-ui'
			});

			useAppStore.getState().setters.addRoute({
				id: 'files',
				route: 'files',
				position: 2,
				visible: true,
				label: 'Files',
				primaryBar: 'DriveOutline',
				appView: FilesView,
				badge: { show: false },
				app: 'carbonio-files-ui'
			});
		});

		const mailsIcon = getByRoleWithIcon('button', { icon: 'MailModOutline' });
		expect(mailsIcon).toBeVisible();
		expect(mailsIcon).toBeEnabled();
		const filesIcon = getByRoleWithIcon('button', { icon: 'DriveOutline' });
		expect(filesIcon).toBeVisible();
		expect(filesIcon).toBeEnabled();

		expect(screen.getByText('default mails view')).toBeVisible();
		expect(screen.queryByText('about')).not.toBeInTheDocument();
		expect(screen.queryByText('files view')).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'navigate to about' }));
		expect(screen.getByText('about')).toBeVisible();
		expect(screen.queryByText('default mails view')).not.toBeInTheDocument();
		expect(screen.queryByText('files view')).not.toBeInTheDocument();

		await user.click(filesIcon);
		expect(screen.getByText('files view')).toBeVisible();
		expect(screen.queryByText('about')).not.toBeInTheDocument();
		expect(screen.queryByText('default mails view')).not.toBeInTheDocument();

		await user.click(mailsIcon);
		expect(screen.getByText('about')).toBeVisible();
		expect(screen.queryByText('default mails view')).not.toBeInTheDocument();
		expect(screen.queryByText('files view')).not.toBeInTheDocument();
	});

	test('When I move to the search module from any other component the search header selector and search view are switched based on the module from which I originate', async () => {
		const { getByRoleWithIcon, user } = setup(<ShellWrapper />);

		act(() => {
			useAppStore.getState().setters.setApps([
				{
					commit: '',
					description: 'Mails module',
					display: 'Mails',
					icon: 'MailModOutline',
					js_entrypoint: '',
					name: 'carbonio-mails-ui',
					priority: 1,
					type: 'carbonio',
					version: '0.0.1'
				},
				{
					commit: '',
					description: 'Files module',
					display: 'Files',
					icon: 'DriveOutline',
					js_entrypoint: '',
					name: 'carbonio-files-ui',
					priority: 2,
					type: 'carbonio',
					version: '0.0.1'
				}
			]);
			useAppStore.getState().setters.addRoute({
				id: 'mails',
				route: 'mails',
				position: 1,
				visible: true,
				label: 'Mails',
				primaryBar: 'MailModOutline',
				appView: MailsView,
				badge: { show: false },
				app: 'carbonio-mails-ui'
			});

			useAppStore.getState().setters.addRoute({
				id: 'files',
				route: 'files',
				position: 2,
				visible: true,
				label: 'Files',
				primaryBar: 'DriveOutline',
				appView: FilesView,
				badge: { show: false },
				app: 'carbonio-files-ui'
			});

			useAppStore.getState().setters.addSearchView({
				route: 'files',
				component: (): React.JSX.Element => <Text>files search view</Text>,
				label: 'Files',
				id: 'files',
				app: 'carbonio-files-ui',
				icon: 'DriveOutline',
				position: 2
			});
			useAppStore.getState().setters.addSearchView({
				route: 'mails',
				component: (): React.JSX.Element => <Text>mails search view</Text>,
				label: 'Mails',
				id: 'mails',
				app: 'carbonio-mails-ui',
				icon: 'MailModOutline',
				position: 1
			});
		});

		const mailsIcon = getByRoleWithIcon('button', { icon: 'MailModOutline' });
		expect(mailsIcon).toBeVisible();
		expect(mailsIcon).toBeEnabled();
		const filesIcon = getByRoleWithIcon('button', { icon: 'DriveOutline' });
		expect(filesIcon).toBeVisible();
		expect(filesIcon).toBeEnabled();
		const searchIcon = getByRoleWithIcon('button', { icon: 'SearchModOutline' });
		expect(searchIcon).toBeVisible();
		expect(searchIcon).toBeEnabled();

		expect(screen.getByText('default mails view')).toBeVisible();
		expect(screen.queryByText('files view')).not.toBeInTheDocument();

		await user.click(filesIcon);
		expect(screen.getByText('files view')).toBeVisible();
		expect(screen.queryByText('default mails view')).not.toBeInTheDocument();

		await user.click(searchIcon);

		expect(screen.getByText('files search view')).toBeVisible();
		expect(within(screen.getByTestId('HeaderModuleSelector')).getByText('Files')).toBeVisible();

		expect(screen.queryByText('mails search view')).not.toBeInTheDocument();
		expect(screen.queryByText('default mails view')).not.toBeInTheDocument();
		expect(screen.queryByText('files view')).not.toBeInTheDocument();
	});

	test('When I move to the search module from any other component the search header selector and search view are switched based on the module from which I originate, also if is not the first access to search module', async () => {
		const { getByRoleWithIcon, user } = setup(<ShellWrapper />);

		act(() => {
			useAppStore.getState().setters.setApps([
				{
					commit: '',
					description: 'Mails module',
					display: 'Mails',
					icon: 'MailModOutline',
					js_entrypoint: '',
					name: 'carbonio-mails-ui',
					priority: 1,
					type: 'carbonio',
					version: '0.0.1'
				},
				{
					commit: '',
					description: 'Files module',
					display: 'Files',
					icon: 'DriveOutline',
					js_entrypoint: '',
					name: 'carbonio-files-ui',
					priority: 2,
					type: 'carbonio',
					version: '0.0.1'
				}
			]);
			useAppStore.getState().setters.addRoute({
				id: 'mails',
				route: 'mails',
				position: 1,
				visible: true,
				label: 'Mails',
				primaryBar: 'MailModOutline',
				appView: MailsView,
				badge: { show: false },
				app: 'carbonio-mails-ui'
			});

			useAppStore.getState().setters.addRoute({
				id: 'files',
				route: 'files',
				position: 2,
				visible: true,
				label: 'Files',
				primaryBar: 'DriveOutline',
				appView: FilesView,
				badge: { show: false },
				app: 'carbonio-files-ui'
			});

			useAppStore.getState().setters.addSearchView({
				route: 'files',
				component: (): React.JSX.Element => <Text>files search view</Text>,
				label: 'Files',
				id: 'files',
				app: 'carbonio-files-ui',
				icon: 'DriveOutline',
				position: 2
			});
			useAppStore.getState().setters.addSearchView({
				route: 'mails',
				component: (): React.JSX.Element => <Text>mails search view</Text>,
				label: 'Mails',
				id: 'mails',
				app: 'carbonio-mails-ui',
				icon: 'MailModOutline',
				position: 1
			});
		});

		const mailsIcon = getByRoleWithIcon('button', { icon: 'MailModOutline' });
		expect(mailsIcon).toBeVisible();
		expect(mailsIcon).toBeEnabled();
		const filesIcon = getByRoleWithIcon('button', { icon: 'DriveOutline' });
		expect(filesIcon).toBeVisible();
		expect(filesIcon).toBeEnabled();
		const searchIcon = getByRoleWithIcon('button', { icon: 'SearchModOutline' });
		expect(searchIcon).toBeVisible();
		expect(searchIcon).toBeEnabled();

		expect(screen.getByText('default mails view')).toBeVisible();
		expect(screen.queryByText('files view')).not.toBeInTheDocument();

		await user.click(filesIcon);
		expect(screen.getByText('files view')).toBeVisible();
		expect(screen.queryByText('default mails view')).not.toBeInTheDocument();

		await user.click(searchIcon);

		expect(screen.getByText('files search view')).toBeVisible();
		expect(within(screen.getByTestId('HeaderModuleSelector')).getByText('Files')).toBeVisible();

		expect(screen.queryByText('mails search view')).not.toBeInTheDocument();
		expect(screen.queryByText('default mails view')).not.toBeInTheDocument();
		expect(screen.queryByText('files view')).not.toBeInTheDocument();

		await user.click(mailsIcon);
		expect(screen.getByText('default mails view')).toBeVisible();
		expect(screen.queryByText('files view')).not.toBeInTheDocument();
		expect(screen.queryByText('files search view')).not.toBeInTheDocument();

		await user.click(searchIcon);

		expect(screen.getByText('mails search view')).toBeVisible();
		expect(within(screen.getByTestId('HeaderModuleSelector')).getByText('Mails')).toBeVisible();

		expect(screen.queryByText('files search view')).not.toBeInTheDocument();
		expect(screen.queryByText('default mails view')).not.toBeInTheDocument();
		expect(screen.queryByText('files view')).not.toBeInTheDocument();
	});

	test('When zimbraFeatureOptionsEnabled is TRUE the setting icon is visible in primary bar', async () => {
		useAccountStore.setState(
			produce((state: AccountState) => {
				state.settings.attrs.zimbraFeatureOptionsEnabled = 'TRUE';
			})
		);
		const { getByRoleWithIcon } = setup(<ShellWrapper />);

		const searchIcon = getByRoleWithIcon('button', { icon: ICONS.settings });
		expect(searchIcon).toBeVisible();
		expect(searchIcon).toBeEnabled();
	});

	test('When zimbraFeatureOptionsEnabled is FALSE the setting icon is missing in primary bar', async () => {
		useAccountStore.setState(
			produce((state: AccountState) => {
				state.settings.attrs.zimbraFeatureOptionsEnabled = 'FALSE';
			})
		);
		const { queryByRoleWithIcon } = setup(<ShellWrapper />);

		expect(queryByRoleWithIcon('button', { icon: ICONS.settings })).not.toBeInTheDocument();
	});
});
