/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { notifyBeforeShellExit, onBeforeShellExit } from './before-shell-exit';
import { goTo, goToLogin } from './utils';

describe('before shell exit', () => {
	const assign = vi.fn();

	beforeEach(() => {
		vi.spyOn(window, 'location', 'get').mockReturnValue({
			...window.location,
			origin: 'http://localhost',
			assign
		});
	});

	it('notifies every subscribed listener', () => {
		const first = vi.fn();
		const second = vi.fn();
		const unsubscribeFirst = onBeforeShellExit(first);
		const unsubscribeSecond = onBeforeShellExit(second);
		notifyBeforeShellExit();
		expect(first).toHaveBeenCalledTimes(1);
		expect(second).toHaveBeenCalledTimes(1);
		unsubscribeFirst();
		unsubscribeSecond();
	});

	it('does not notify a listener after it unsubscribed', () => {
		const listener = vi.fn();
		onBeforeShellExit(listener)();
		notifyBeforeShellExit();
		expect(listener).not.toHaveBeenCalled();
	});

	it('keeps notifying the other listeners when one throws', () => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const failing = vi.fn(() => {
			throw new Error('boom');
		});
		const other = vi.fn();
		const unsubscribeFailing = onBeforeShellExit(failing);
		const unsubscribeOther = onBeforeShellExit(other);
		notifyBeforeShellExit();
		expect(other).toHaveBeenCalledTimes(1);
		unsubscribeFailing();
		unsubscribeOther();
	});

	it.each([
		['goToLogin', (): void => goToLogin()],
		['goTo', (): void => goTo('/somewhere')]
	])('%s notifies the listeners before navigating', (_, navigate) => {
		const order: string[] = [];
		const unsubscribe = onBeforeShellExit(() => order.push('listener'));
		assign.mockImplementation(() => order.push('assign'));
		navigate();
		expect(order).toEqual(['listener', 'assign']);
		unsubscribe();
	});
});
