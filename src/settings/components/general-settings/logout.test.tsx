/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act, screen, waitFor } from '@testing-library/react';

import { Logout } from './logout';
import { waitForRequest } from '../../../mocks/server';
import * as networkUtils from '../../../network/utils';
import { useLoginConfigStore } from '../../../store/login/store';
import { setup } from '../../../test/utils';

describe('Logout', () => {
	test('should redirect to custom logout url on manual logout', async () => {
		const customLogout = 'custom.logout.url';
		const goToFn = jest.spyOn(networkUtils, 'goTo').mockImplementation();
		const goToLoginFn = jest.spyOn(networkUtils, 'goToLogin').mockImplementation();
		useLoginConfigStore.setState((s) => ({ ...s, carbonioWebUiLogoutURL: customLogout }));
		const { user } = setup(<Logout />);
		const logout = waitForRequest('get', '/?loginOp=logout');
		await user.click(screen.getByRole('button', { name: /logout/i }));
		await logout;
		act(() => {
			jest.runOnlyPendingTimers();
		});
		await waitFor(() => expect(goToFn).toHaveBeenCalled());
		expect(goToFn).toHaveBeenCalledTimes(1);
		expect(goToFn).toHaveBeenCalledWith(customLogout);
		expect(goToLoginFn).not.toHaveBeenCalled();
	});

	test('should redirect to login if no custom logout url is set', async () => {
		const goToFn = jest.spyOn(networkUtils, 'goTo').mockImplementation();
		const goToLoginFn = jest.spyOn(networkUtils, 'goToLogin').mockImplementation();
		useLoginConfigStore.setState((s) => ({ ...s, carbonioWebUiLogoutURL: '' }));
		const { user } = setup(<Logout />);
		const logout = waitForRequest('get', '/?loginOp=logout');
		await user.click(screen.getByRole('button', { name: /logout/i }));
		await logout;
		act(() => {
			jest.runOnlyPendingTimers();
		});
		await waitFor(() => expect(goToLoginFn).toHaveBeenCalled());
		expect(goToLoginFn).toHaveBeenCalledTimes(1);
		expect(goToFn).not.toHaveBeenCalled();
	});
});
