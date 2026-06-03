/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { act, waitFor } from '@testing-library/react';
import { api } from '@zextras/carbonio-ui-soap-lib';

import type { AccountMenuAction } from './bar';
import { ShellUtilityBar } from './bar';
import { ACTION_TYPES } from '../constants';
import { waitForRequest } from '../mocks/server';
import * as networkUtils from '../network/utils';
import { useIntegrationsStore } from '../store/integrations/store';
import { useLoginConfigStore } from '../store/login/store';
import { mockedAccount, setupAccountStore } from '../tests/account-utils';
import { ICONS } from '../tests/constants';
import { screen, setup } from '../tests/utils';

describe('Shell utility bar', () => {
	it('should render the utility menu for the account', async () => {
		setupAccountStore();
		const { user } = setup(<ShellUtilityBar />);

		const accountUtilityMenu = screen.getByRoleWithIcon('button', {
			icon: ICONS.accountUtilityMenu
		});
		expect(accountUtilityMenu, 'the account utility menu button should be visible').toBeVisible();
		await user.click(accountUtilityMenu);
		expect(
			screen.getByText(mockedAccount.displayName),
			'the account display name should be shown in the open utility menu'
		).toBeVisible();
		expect(
			screen.getByText(mockedAccount.name),
			'the account name should be shown in the open utility menu'
		).toBeVisible();
	});

	it.each(['Update view', 'Documentation', 'Logout'])(
		'should show the entry "%s" inside the account utility menu',
		async (item) => {
			const { user } = setup(<ShellUtilityBar />);

			await user.click(
				screen.getByRoleWithIcon('button', {
					icon: ICONS.accountUtilityMenu
				})
			);
			expect(
				screen.getByText(item),
				`the "${item}" entry should be visible inside the account utility menu`
			).toBeVisible();
		}
	);

	it('should show registered account menu actions', async () => {
		const action = {
			position: 1,
			id: 'account-menu-action',
			label: 'Account menu action',
			icon: 'CloudUploadOutline',
			execute: vi.fn(),
			disabled: false
		} satisfies AccountMenuAction;

		useIntegrationsStore.getState().registerActions({
			id: 'account-menu-action',
			type: ACTION_TYPES.ACCOUNT_MENU,
			action: () => action
		});
		const { user } = setup(<ShellUtilityBar />);
		await user.click(
			screen.getByRoleWithIcon('button', {
				icon: ICONS.accountUtilityMenu
			})
		);
		expect(
			screen.getByText(action.label),
			'the registered account menu action label should be visible'
		).toBeVisible();
		expect(
			screen.getByTestId('icon: CloudUploadOutline'),
			'the registered account menu action icon should be visible'
		).toBeVisible();
	});

	it('should execute the action when clicking on it', async () => {
		const action = {
			position: 1,
			id: 'account-menu-action',
			label: 'Account menu action',
			icon: 'CloudUploadOutline',
			execute: vi.fn(),
			disabled: false
		} satisfies AccountMenuAction;

		useIntegrationsStore.getState().registerActions({
			id: 'account-menu-action',
			type: ACTION_TYPES.ACCOUNT_MENU,
			action: () => action
		});
		const { user } = setup(<ShellUtilityBar />);
		await user.click(
			screen.getByRoleWithIcon('button', {
				icon: ICONS.accountUtilityMenu
			})
		);
		await user.click(screen.getByText(action.label));
		expect(
			action.execute,
			'the action execute callback should be called when its menu item is clicked'
		).toHaveBeenCalled();
	});

	it('should not call disabled account menu action', async () => {
		const action = {
			position: 1,
			id: 'account-menu-action',
			label: 'Account menu action',
			icon: 'CloudUploadOutline',
			execute: vi.fn(),
			disabled: true
		} satisfies AccountMenuAction;

		useIntegrationsStore.getState().registerActions({
			id: 'account-menu-action',
			type: ACTION_TYPES.ACCOUNT_MENU,
			action: () => action
		});
		const { user } = setup(<ShellUtilityBar />);
		await user.click(
			screen.getByRoleWithIcon('button', {
				icon: ICONS.accountUtilityMenu
			})
		);
		await user.click(screen.getByText(action.label));
		expect(
			action.execute,
			'a disabled action execute callback should not be called when its menu item is clicked'
		).not.toHaveBeenCalled();
	});

	it('should show account menu action items in the correct order', async () => {
		const action1 = {
			position: 1,
			id: 'account-menu-action-1',
			label: 'Account menu action 1',
			icon: 'CloudUploadOutline',
			execute: vi.fn(),
			disabled: false
		} satisfies AccountMenuAction;
		const action2 = {
			position: 2,
			id: 'account-menu-action-2',
			label: 'Account menu action 2',
			icon: 'CloudUploadOutline',
			execute: vi.fn(),
			disabled: false
		} satisfies AccountMenuAction;
		const action3 = {
			position: 3,
			id: 'account-menu-action-3',
			label: 'Account menu action 3',
			icon: 'CloudUploadOutline',
			execute: vi.fn(),
			disabled: false
		} satisfies AccountMenuAction;

		useIntegrationsStore.getState().registerActions(
			{
				id: 'account-menu-action-3',
				type: ACTION_TYPES.ACCOUNT_MENU,
				action: () => action3
			},
			{
				id: 'account-menu-action-1',
				type: ACTION_TYPES.ACCOUNT_MENU,
				action: () => action1
			},
			{
				id: 'account-menu-action-2',
				type: ACTION_TYPES.ACCOUNT_MENU,
				action: () => action2
			}
		);
		const { user } = setup(<ShellUtilityBar />);
		await user.click(
			screen.getByRoleWithIcon('button', {
				icon: ICONS.accountUtilityMenu
			})
		);
		const items = screen.getAllByTestId('dropdown-item');
		// The first 3 items are the account name, email and the update view action
		expect(
			items[3],
			'the action with position 1 should be rendered first among the registered actions'
		).toHaveTextContent(action1.label);
		expect(
			items[4],
			'the action with position 2 should be rendered second among the registered actions'
		).toHaveTextContent(action2.label);
		expect(
			items[5],
			'the action with position 3 should be rendered third among the registered actions'
		).toHaveTextContent(action3.label);
	});

	it('should redirect to custom logout url when user clicks on logout', async () => {
		vi.spyOn(api, 'endSession').mockReturnValueOnce(
			Promise.resolve({
				Header: { context: {} },
				Body: {}
			})
		);
		const customLogout = 'custom.logout.url';
		const goToFn = vi.spyOn(networkUtils, 'goTo').mockImplementation(() => {});
		const goToLoginFn = vi.spyOn(networkUtils, 'goToLogin').mockImplementation(() => {});
		useLoginConfigStore.setState((s) => ({ ...s, carbonioWebUiLogoutURL: customLogout }));
		const { user } = setup(<ShellUtilityBar />);
		const logout = waitForRequest('get', '/logout');
		await user.click(screen.getByRoleWithIcon('button', { icon: ICONS.accountUtilityMenu }));
		await user.click(screen.getByText(/logout/i));
		await logout;
		act(() => {
			vi.runOnlyPendingTimers();
		});
		await waitFor(() =>
			expect(
				goToFn,
				'goTo should be called to redirect to the custom logout url'
			).toHaveBeenCalled()
		);
		expect(goToFn, 'goTo should be called exactly once').toHaveBeenCalledTimes(1);
		expect(
			goToFn,
			'goTo should be called with the configured custom logout url'
		).toHaveBeenCalledWith(customLogout);
		expect(
			goToLoginFn,
			'goToLogin should not be called when a custom logout url is configured'
		).not.toHaveBeenCalled();
	});

	test('should redirect to login if no custom logout url is set when user clicks on logout', async () => {
		vi.spyOn(api, 'endSession').mockReturnValueOnce(
			Promise.resolve({
				Header: { context: {} },
				Body: {}
			})
		);
		const goToFn = vi.spyOn(networkUtils, 'goTo').mockImplementation(() => {});
		const goToLoginFn = vi.spyOn(networkUtils, 'goToLogin').mockImplementation(() => {});
		useLoginConfigStore.setState((s) => ({ ...s, carbonioWebUiLogoutURL: '' }));
		const { user } = setup(<ShellUtilityBar />);
		const logout = waitForRequest('get', '/logout');
		await user.click(screen.getByRoleWithIcon('button', { icon: ICONS.accountUtilityMenu }));
		await user.click(screen.getByText(/logout/i));
		await logout;
		act(() => {
			vi.runOnlyPendingTimers();
		});
		await waitFor(() =>
			expect(
				goToLoginFn,
				'goToLogin should be called to redirect to the login page when no custom logout url is set'
			).toHaveBeenCalled()
		);
		expect(goToLoginFn, 'goToLogin should be called exactly once').toHaveBeenCalledTimes(1);
		expect(
			goToFn,
			'goTo should not be called when no custom logout url is configured'
		).not.toHaveBeenCalled();
	});

	it('should dispatch customEvent when updating the view', async () => {
		const handlerFn = vi.fn();
		window.addEventListener('updateView', handlerFn);
		const { user } = setup(<ShellUtilityBar />);
		const accountUtilityMenu = screen.getByRoleWithIcon('button', {
			icon: ICONS.accountUtilityMenu
		});
		await user.click(accountUtilityMenu);
		await user.click(screen.getByText(/update view/i));
		expect(
			handlerFn,
			'the "updateView" custom event handler should be called when clicking the update view entry'
		).toHaveBeenCalled();
	});
});
