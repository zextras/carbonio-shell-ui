/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act, waitFor } from '@testing-library/react';
import { http } from 'msw';

import { ShellUtilityBar } from './bar';
import { logout as logoutHandler } from '../mocks/handlers/logout';
import { zxAuthLogout as zxAuthLogoutHandler } from '../mocks/handlers/zx-auth-logout';
import server, { waitForRequest } from '../mocks/server';
import * as network from '../network/fetch';
import * as networkUtils from '../network/utils';
import { useLoginConfigStore } from '../store/login/store';
import { mockedAccount, setupAccountStore } from '../test/account-utils';
import { ICONS } from '../test/constants';
import { screen, setup } from '../test/utils';

describe('Shell utility bar', () => {
	test('should render the utility menu for the account', async () => {
		setupAccountStore();
		const { user } = setup(<ShellUtilityBar />);

		const accountUtilityMenu = screen.getByRoleWithIcon('button', {
			icon: ICONS.accountUtilityMenu
		});
		expect(accountUtilityMenu).toBeVisible();
		await user.click(accountUtilityMenu);
		await screen.findByText(mockedAccount.displayName);
		expect(screen.getByText(mockedAccount.displayName)).toBeVisible();
		expect(screen.getByText(mockedAccount.name)).toBeVisible();
		expect(screen.getByText(/update view/i)).toBeVisible();
	});

	test.each(['Update view', 'Documentation', 'Logout'])(
		'should show the entry "%s" inside the account utility menu',
		async (item) => {
			setupAccountStore();
			const { user } = setup(<ShellUtilityBar />);

			const accountUtilityMenu = screen.getByRoleWithIcon('button', {
				icon: ICONS.accountUtilityMenu
			});
			expect(accountUtilityMenu).toBeVisible();
			await user.click(accountUtilityMenu);
			await screen.findByText(mockedAccount.displayName);
			expect(screen.getByText(item)).toBeVisible();
		}
	);

	test('should redirect to custom logout url when user clicks on logout', async () => {
		const customLogout = 'custom.logout.url';
		const goToFn = jest.spyOn(networkUtils, 'goTo').mockImplementation();
		const goToLoginFn = jest.spyOn(networkUtils, 'goToLogin').mockImplementation();
		useLoginConfigStore.setState((s) => ({
			...s,
			carbonioWebUiLogoutURL: customLogout,
			isCarbonioCE: true
		}));
		const { user } = setup(<ShellUtilityBar />);
		const logout = waitForRequest('get', '/logout');
		await user.click(screen.getByRoleWithIcon('button', { icon: ICONS.accountUtilityMenu }));
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

	test('should redirect to login if no custom logout url is set when user clicks on logout', async () => {
		const goToFn = jest.spyOn(networkUtils, 'goTo').mockImplementation();
		const goToLoginFn = jest.spyOn(networkUtils, 'goToLogin').mockImplementation();
		useLoginConfigStore.setState((s) => ({ ...s, carbonioWebUiLogoutURL: '', isCarbonioCE: true }));
		const { user } = setup(<ShellUtilityBar />);
		const logout = waitForRequest('get', '/logout');
		await user.click(screen.getByRoleWithIcon('button', { icon: ICONS.accountUtilityMenu }));
		await user.click(screen.getByText(/logout/i));
		await logout;
		act(() => {
			jest.runOnlyPendingTimers();
		});
		await waitFor(() => expect(goToLoginFn).toHaveBeenCalled());
		expect(goToLoginFn).toHaveBeenCalledTimes(1);
		expect(goToFn).not.toHaveBeenCalled();
	});

	test('should call /logout when isCarbonioCE is true', async () => {
		jest.spyOn(networkUtils, 'goToLogin').mockImplementation();

		const logoutHandlerMock = jest.fn(logoutHandler);
		server.use(http.get('/logout', logoutHandlerMock));

		const zxAuthLogoutHandlerMock = jest.fn(zxAuthLogoutHandler);
		server.use(http.get('/zx/auth/logout', zxAuthLogoutHandlerMock));

		useLoginConfigStore.setState((s) => ({ ...s, isCarbonioCE: true }));
		const logout = waitForRequest('get', '/logout');
		const { user } = setup(<ShellUtilityBar />);

		await user.click(screen.getByRoleWithIcon('button', { icon: ICONS.accountUtilityMenu }));
		await user.click(screen.getByText(/logout/i));
		await logout;

		await waitFor(() => expect(logoutHandlerMock).toHaveBeenCalled());
		expect(zxAuthLogoutHandlerMock).not.toHaveBeenCalled();
	});

	test('should call /zx/auth/logout when isCarbonioCE is false', async () => {
		jest.spyOn(networkUtils, 'goToLogin').mockImplementation();

		const logoutHandlerMock = jest.fn(logoutHandler);
		server.use(http.get('/logout', logoutHandlerMock));

		const zxAuthLogoutHandlerMock = jest.fn(zxAuthLogoutHandler);
		server.use(http.get('/zx/auth/logout', zxAuthLogoutHandlerMock));

		useLoginConfigStore.setState((s) => ({ ...s, isCarbonioCE: false }));
		const logout = waitForRequest('get', '/zx/auth/logout');
		const { user } = setup(<ShellUtilityBar />);

		await user.click(screen.getByRoleWithIcon('button', { icon: ICONS.accountUtilityMenu }));
		await user.click(screen.getByText(/logout/i));
		await logout;

		await waitFor(() => expect(zxAuthLogoutHandlerMock).toHaveBeenCalled());
		expect(logoutHandlerMock).not.toHaveBeenCalled();
	});

	it('should dispatch customEvent when updating the view', async () => {
		const handlerFn = jest.fn();
		window.addEventListener('updateView', handlerFn);
		jest.spyOn(network, 'fetchNoOp').mockImplementation();
		const { user } = setup(<ShellUtilityBar />);
		const accountUtilityMenu = screen.getByRoleWithIcon('button', {
			icon: ICONS.accountUtilityMenu
		});
		await user.click(accountUtilityMenu);
		await user.click(screen.getByText(/update view/i));
		expect(handlerFn).toHaveBeenCalled();
	});
});
