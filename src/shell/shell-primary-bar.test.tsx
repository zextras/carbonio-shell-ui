/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { screen } from '@testing-library/react';
import { Button, Text } from '@zextras/carbonio-design-system';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';

import AppViewContainer from './app-view-container';
import ShellPrimaryBar from './shell-primary-bar';
import { PrimaryBarView } from '../../types';
import { usePushHistoryCallback } from '../history/hooks';
import { useAppStore } from '../store/app';
import { setup } from '../test/utils';

const ShellWrapper = (): JSX.Element => (
	<>
		<ShellPrimaryBar />
		<AppViewContainer />
	</>
);

const AboutView = (): JSX.Element | null => {
	const { view } = useParams<{ view: string }>();
	return (
		<div>
			<Text>{view}</Text>
		</div>
	);
};

const MailsView = (): JSX.Element => {
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

const FilesView = (): JSX.Element => (
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
		useAppStore.getState().setters.addApps([
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

		const { getByRoleWithIcon, user } = setup(<ShellWrapper />);
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
});
