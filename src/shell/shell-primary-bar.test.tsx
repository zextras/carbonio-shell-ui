/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';
import { setup } from '../test/utils';
import ShellPrimaryBar from './shell-primary-bar';
import { useAppStore } from '../store/app';
import { PrimaryBarView } from '../../types';

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
});
