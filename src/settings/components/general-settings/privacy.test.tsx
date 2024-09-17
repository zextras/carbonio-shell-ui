/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { Privacy } from './privacy';
import { ICONS } from '../../../tests/constants';
import { screen, setup } from '../../../tests/utils';
import type { AddMod } from '../../../types/network';

describe('Privacy', () => {
	it.each([
		[true, ICONS.checkboxChecked],
		[false, ICONS.checkboxUnchecked]
	])(
		'should render the checkbox to allow analytics (initial value %s)',
		async (initialValue, checkbox) => {
			setup(<Privacy addMod={jest.fn()} sendAnalyticsPref={initialValue} removeMod={jest.fn()} />);
			expect(screen.getByText('Allow data analytics')).toBeVisible();
			expect(
				screen.getByText(
					'Your data is safe. All information we gather is and will stay anonymous. It will be used by our team to understand how can we improve Carbonio.'
				)
			).toBeVisible();
			expect(screen.getByTestId(checkbox)).toBeVisible();
		}
	);

	it('should add the value of the carbonioPrefSendAnalytics when different, remove it when equal to the initial one', async () => {
		const addModFn = jest.fn();
		const removeModFn = jest.fn();
		const { user } = setup(
			<Privacy addMod={addModFn} sendAnalyticsPref={false} removeMod={removeModFn} />
		);
		await user.click(screen.getByTestId(ICONS.checkboxUnchecked));
		expect(addModFn).toHaveBeenCalledWith<Parameters<AddMod>>(
			'prefs',
			'carbonioPrefSendAnalytics',
			'TRUE'
		);
		expect(removeModFn).not.toHaveBeenCalled();
		await user.click(screen.getByTestId(ICONS.checkboxChecked));
		expect(addModFn).toHaveBeenCalledTimes(1);
		expect(removeModFn).toHaveBeenCalled();
	});
});
