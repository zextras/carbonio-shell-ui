/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { faker } from '@faker-js/faker';
import type { QuotaProps } from '@zextras/carbonio-design-system';
import { produce } from 'immer';

import UserQuota from './user-quota';
import { useAccountStore } from '../../../store/account';
import { screen, setup } from '../../../tests/utils';
import { humanFileSize } from '../utils';

function setupAccountStore(usedQuota: number, quotaMax: number): void {
	useAccountStore.setState(
		produce((state) => {
			state.usedQuota = usedQuota;
			state.settings.attrs.zimbraMailQuota = quotaMax;
		})
	);
}

const mockQuota = jest.fn().mockReturnValue(<div>mock Quota</div>);

jest.mock('@zextras/carbonio-design-system', () => ({
	...jest.requireActual('@zextras/carbonio-design-system'),
	Quota: (props: QuotaProps): unknown => mockQuota(props)
}));

describe('User Quota', () => {
	it.each([0, -1])(
		'should show the string "[used] of unlimited space" if zimbraMailQuota is %s',
		(quota) => {
			const quotaUsed = faker.number.int();
			setupAccountStore(quotaUsed, quota);
			setup(<UserQuota mobileView={false} />);
			const quotaString = `${humanFileSize(quotaUsed, undefined)} of unlimited space`;
			expect(screen.getByText(quotaString)).toBeVisible();
		}
	);

	it('should show the string "[used] of [limit] used”', () => {
		const quotaUsed = faker.number.int();
		const quotaMax = 100;
		setupAccountStore(quotaUsed, quotaMax);
		setup(<UserQuota mobileView={false} />);
		const quotaString = `${humanFileSize(quotaUsed, undefined)} of ${humanFileSize(quotaMax, undefined)} used`;
		expect(screen.getByText(quotaString)).toBeVisible();
	});

	describe('Quota component', () => {
		it.each([
			['primary', 0, 89],
			['warning', 90, 94],
			['error', 95, undefined]
		])(
			'should render Quota component with props fillBackground %s when the used quota is >= %s',
			(fillBackground, minQuotaUsed, maxQuotaUsed) => {
				const quotaUsed = faker.number.int({ min: minQuotaUsed, max: maxQuotaUsed });
				const quotaMax = 100;
				setupAccountStore(quotaUsed, quotaMax);
				setup(<UserQuota mobileView={false} />);
				expect(mockQuota).toHaveBeenCalledWith({
					fill: Math.min(100, Math.round((quotaUsed / quotaMax) * 100)),
					fillBackground
				});
			}
		);

		it('should render Quota component with props fillBackground gray4 when the quota is unlimited', () => {
			const quotaUsed = faker.number.int();
			const quotaMax = -1;
			setupAccountStore(quotaUsed, quotaMax);
			setup(<UserQuota mobileView={false} />);
			expect(mockQuota).toHaveBeenCalledWith({
				fill: 100,
				fillBackground: 'gray4'
			});
		});
	});
});
