/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act, screen, waitFor } from '@testing-library/react';

import { ShellUtilityBar } from './bar';
import { mockedAccount, setupAccountStore } from '../test/account-utils';
import { ICONS } from '../test/constants';
import { setup } from '../test/utils';
import * as networkUtils from '../network/utils';
import { useLoginConfigStore } from '../store/login/store';
import { Logout } from '../settings/components/general-settings/logout';
import { waitForRequest } from '../mocks/server';

describe('Shell utility bar', () => {
	test('should render the utility menu for the account', async () => {
		setupAccountStore();
		const { getByRoleWithIcon, user } = setup(<ShellUtilityBar />);

		const accountUtilityMenu = getByRoleWithIcon('button', { icon: ICONS.accountUtilityMenu });
		expect(accountUtilityMenu).toBeVisible();
		await user.click(accountUtilityMenu);
		await screen.findByText(mockedAccount.displayName);
		expect(screen.getByText(mockedAccount.displayName)).toBeVisible();
		expect(screen.getByText(mockedAccount.name)).toBeVisible();
		expect(screen.getByText(/feedback/i)).toBeVisible();
		expect(screen.getByText(/update view/i)).toBeVisible();
	});

	test.each(['Feedback', 'Update view', 'Documentation', 'Logout'])(
		'should show the entry "%s" inside the account utility menu',
		async () => {
			setupAccountStore();
			const { getByRoleWithIcon, user } = setup(<ShellUtilityBar />);

			const accountUtilityMenu = getByRoleWithIcon('button', { icon: ICONS.accountUtilityMenu });
			expect(accountUtilityMenu).toBeVisible();
			await user.click(accountUtilityMenu);
			await screen.findByText(mockedAccount.displayName);
			expect(screen.getByText(/feedback/i)).toBeVisible();
		}
	);

	test('should redirect to logout if user clicks on logout', async () => {
		const customLogout = 'custom.logout.url';
		const goToFn = jest.spyOn(networkUtils, 'goTo').mockImplementation();
		const goToLoginFn = jest.spyOn(networkUtils, 'goToLogin').mockImplementation();
		useLoginConfigStore.setState((s) => ({ ...s, carbonioWebUiLogoutURL: customLogout }));
		const { user, getByRoleWithIcon } = setup(<ShellUtilityBar />);
		const logout = waitForRequest('get', '/?loginOp=logout');
		await user.click(getByRoleWithIcon('button', { icon: ICONS.accountUtilityMenu }));
		await user.click(screen.getByText(/logout/i));
		await logout;
		act(() => {
			jest.runOnlyPendingTimers();
		});
		await waitFor(() => expect(goToFn).toHaveBeenCalled());
		expect(goToFn).toHaveBeenCalledTimes(1);
		expect(goToFn).toHaveBeenCalledWith(customLogout);
		expect(goToLoginFn).not.toHaveBeenCalled();
	});
});
