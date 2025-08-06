/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act } from '@testing-library/react';
import { Button, Text } from '@zextras/carbonio-design-system';
import { produce } from 'immer';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';

import AppViewContainer from './app-view-container';
import ShellPrimaryBar from './shell-primary-bar';
import { DefaultViewsRegister } from '../boot/app/default-views';
import { useAccountStore } from '../store/account';
import { useAppStore } from '../store/app';
import { ICONS } from '../tests/constants';
import { screen, setup } from '../tests/utils';
import type { AccountState } from '../types/account';
import type { PrimaryBarView } from '../types/apps';

const ShellWrapper = (): React.JSX.Element => (
	<>
		<DefaultViewsRegister />
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
	const navigate = useNavigate();
	return (
		<Routes>
			<Route path={`:view`} element={<AboutView />} />
			<Route
				path={`/`}
				element={
					<>
						<Text>default mails view</Text>
						<Button label={'navigate to about'} onClick={(): void => navigate('about')} />
					</>
				}
			/>
		</Routes>
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
			useAppStore.getState().setApps([
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
			useAppStore.getState().addRoute({
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

			useAppStore.getState().addRoute({
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

	describe('Primary Badge', () => {
		test('should render the counter badge if show and showCount are true and count is valued', () => {
			const primaryBarViews: PrimaryBarView[] = [
				{
					id: 'pbv-1',
					app: 'app1',
					label: 'App One',
					route: 'app1',
					position: 1,
					badge: { show: true, showCount: true, count: 2 },
					visible: true,
					component: 'People'
				}
			];
			useAppStore.setState((state) => ({
				views: { ...state.views, primaryBar: primaryBarViews }
			}));
			setup(<ShellPrimaryBar />);
			expect(screen.getByTestId('badge-counter')).toBeVisible();
			expect(screen.getByText(2)).toBeVisible();
		});

		test('should render the counter badge to 0 if count is not set', () => {
			const primaryBarViews: PrimaryBarView[] = [
				{
					id: 'pbv-1',
					app: 'app1',
					label: 'App One',
					route: 'app1',
					position: 1,
					badge: { show: true, showCount: true },
					visible: true,
					component: 'People'
				}
			];
			useAppStore.setState((state) => ({
				views: { ...state.views, primaryBar: primaryBarViews }
			}));
			setup(<ShellPrimaryBar />);
			expect(screen.getByTestId('badge-counter')).toBeVisible();
			expect(screen.getByText(0)).toBeVisible();
		});

		test('should not render the counter badge if show is false', () => {
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
				}
			];
			useAppStore.setState((state) => ({
				views: { ...state.views, primaryBar: primaryBarViews }
			}));
			setup(<ShellPrimaryBar />);
			expect(screen.queryByTestId('badge-counter')).not.toBeInTheDocument();
		});

		test('should render an empty badge if show is true and showCount is false', () => {
			const primaryBarViews: PrimaryBarView[] = [
				{
					id: 'pbv-1',
					app: 'app1',
					label: 'App One',
					route: 'app1',
					position: 1,
					badge: { show: true, showCount: false },
					visible: true,
					component: 'People'
				}
			];
			useAppStore.setState((state) => ({
				views: { ...state.views, primaryBar: primaryBarViews }
			}));
			setup(<ShellPrimaryBar />);
			const counterBadge = screen.getByTestId('badge-counter');
			expect(counterBadge).toBeVisible();
			expect(counterBadge).toHaveTextContent('');
		});

		it('should render icon instead of badge when icon is provided in badge info', () => {
			const primaryBarViews: PrimaryBarView[] = [
				{
					id: 'pbv-1',
					app: 'app1',
					label: 'App One',
					route: 'app1',
					position: 1,
					badge: { show: true, icon: 'Airplane', showCount: true },
					visible: true,
					component: 'People'
				}
			];
			useAppStore.setState((state) => ({
				views: { ...state.views, primaryBar: primaryBarViews }
			}));
			setup(<ShellPrimaryBar />);
			expect(screen.queryByTestId('badge-counter')).not.toBeInTheDocument();
			expect(screen.getByTestId('icon: Airplane')).toBeVisible();
		});
		it('shows a tooltip when the user hover a badge', async () => {
			const view: PrimaryBarView = {
				id: 'pbv-1',
				app: 'app1',
				label: 'App One',
				route: 'app1',
				position: 1,
				badge: { show: true, icon: 'Airplane', showCount: true },
				visible: true,
				component: ICONS.accountUtilityMenu
			};
			const primaryBarViews: PrimaryBarView[] = [view];

			useAppStore.setState((state) => ({
				views: { ...state.views, primaryBar: primaryBarViews }
			}));

			const { user } = setup(<ShellPrimaryBar />);

			await user.hover(
				screen.getByRoleWithIcon('button', {
					icon: ICONS.accountUtilityMenu
				})
			);

			act(() => {
				jest.advanceTimersByTime(2000);
			});

			expect(screen.getByText(view.label)).toBeVisible();
		});
	});
});
