/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { produce } from 'immer';

import UserQuota from './user-quota';
import { useAccountStore } from '../../../store/account';
import { screen, setup } from '../../../test/utils';

const quotaMax = 100;
function setupAccountStore(usedQuota = 0): void {
	useAccountStore.setState(
		produce((state) => {
			state.usedQuota = usedQuota;
			state.settings.attrs.zimbraMailQuota = quotaMax;
		})
	);
}
describe('User Quota', () => {
	describe('Quota description', () => {
		it.each([
			['even if it is 0', 0],
			['if it is less than zimbraMailQuota', quotaMax - 1],
			['if it is higher than zimbraMailQuota', quotaMax + 1]
		])('should render the % of quota used message %s', (description, quotaUsed) => {
			setupAccountStore(quotaUsed);
			setup(<UserQuota mobileView={false} />);
			expect(screen.getByText(/user's quota/i)).toBeVisible();
			expect(
				screen.getByText(`You have filled ${quotaUsed}% of the available space`)
			).toBeVisible();
		});

		it.each([0, -1])(
			'should render "You have unlimited space available" message when zimbraMailQuota is %s',
			(quota) => {
				useAccountStore.setState(
					produce((state) => {
						state.settings.attrs.zimbraMailQuota = quota;
					})
				);
				setup(<UserQuota mobileView={false} />);
				expect(screen.getByText(`You have unlimited space available`)).toBeVisible();
			}
		);

		it('should render "It seems that all available space is full" message when the quota used is equal to zimbraMailQuota', () => {
			setupAccountStore(quotaMax);
			setup(<UserQuota mobileView={false} />);
			expect(screen.getByText(`It seems that all available space is full`)).toBeVisible();
		});
	});
});
