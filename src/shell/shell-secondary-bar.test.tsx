/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import ShellSecondaryBar from './shell-secondary-bar';
import { useAppStore } from '../store/app';
import { setup, screen } from '../tests/utils';

const TestComponent = (): React.JSX.Element => <div>test component</div>;
const AppViewComponent = (): React.JSX.Element => <div>app view component</div>;

describe('ShellSecondaryBar', () => {
	it('should render the secondary bar component on proper route', () => {
		useAppStore.getState().addRoute({
			id: 'test',
			route: 'test',
			position: 2,
			visible: true,
			label: 'Test',
			primaryBar: 'DriveOutline',
			appView: AppViewComponent,
			secondaryBar: TestComponent,
			badge: { show: false },
			app: 'carbonio-test-ui'
		});
		setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
		expect(screen.getByText('test component')).toBeVisible();
	});
	it('should not render the secondary bar component on wrong route', () => {
		useAppStore.getState().addRoute({
			id: 'test',
			route: 'test',
			position: 2,
			visible: true,
			label: 'Test',
			primaryBar: 'DriveOutline',
			appView: AppViewComponent,
			secondaryBar: TestComponent,
			badge: { show: false },
			app: 'carbonio-test-ui'
		});
		setup(<ShellSecondaryBar />, { initialRouterEntries: ['/wrong'] });
		expect(screen.queryByText('test component')).not.toBeInTheDocument();
	});
});
