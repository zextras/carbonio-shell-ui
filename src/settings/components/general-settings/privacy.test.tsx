/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
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
			setup(<Privacy addMod={vi.fn()} sendAnalyticsPref={initialValue} removeMod={vi.fn()} />);
			expect(
				screen.getByText('Allow data analytics'),
				'the analytics setting title should be visible'
			).toBeVisible();
			expect(
				screen.getByText(
					'Your data is safe. All information we gather is and will stay anonymous. It will be used by our team to understand how can we improve Carbonio.'
				),
				'the analytics privacy description should be visible'
			).toBeVisible();
			expect(
				screen.getByTestId(checkbox),
				`the checkbox should reflect the initial pref value (${initialValue})`
			).toBeVisible();
		}
	);

	it('should add the value of the carbonioPrefSendAnalytics when different, remove it when equal to the initial one', async () => {
		const addModFn = vi.fn();
		const removeModFn = vi.fn();
		const { user } = setup(
			<Privacy addMod={addModFn} sendAnalyticsPref={false} removeMod={removeModFn} />
		);
		await user.click(screen.getByTestId(ICONS.checkboxUnchecked));
		expect(addModFn, 'checking the box should add the analytics pref as TRUE').toHaveBeenCalledWith<
			Parameters<AddMod>
		>('prefs', 'carbonioPrefSendAnalytics', 'TRUE');
		expect(
			removeModFn,
			'removeMod should not be called while the value differs from the initial one'
		).not.toHaveBeenCalled();
		await user.click(screen.getByTestId(ICONS.checkboxChecked));
		expect(
			addModFn,
			'addMod should not be called again when reverting to the initial value'
		).toHaveBeenCalledTimes(1);
		expect(
			removeModFn,
			'removeMod should be called when the value returns to the initial one'
		).toHaveBeenCalled();
	});
});
