/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { AuthGuard } from './auth-guard';
import * as accountStoreHooks from '../store/account/hooks';
import { setup, screen } from '../tests/utils';

describe('AuthGuard', () => {
	it('should render the child component when the user is authenticated', () => {
		const useAuthenticated = jest.spyOn(accountStoreHooks, 'useAuthenticated');
		useAuthenticated.mockReturnValue(true);

		setup(
			<AuthGuard>
				<p>Authenticated</p>
			</AuthGuard>
		);

		expect(screen.getByText('Authenticated')).toBeInTheDocument();
	});

	it('should not render the child component when the user is authenticated', () => {
		const useAuthenticated = jest.spyOn(accountStoreHooks, 'useAuthenticated');
		useAuthenticated.mockReturnValue(false);

		setup(
			<AuthGuard>
				<p>Authenticated</p>
			</AuthGuard>
		);

		expect(screen.queryByText('Authenticated')).not.toBeInTheDocument();
	});
});
