/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import * as matomo from './matomo';
import { Tracker } from './tracker';

beforeEach(() => {
	Tracker.enableTracker(false);
});
describe('Tracker', () => {
	it('should not call trackPageView when Tracker.isEnabled is false(default)', () => {
		const trackPageView = jest.fn();
		jest.spyOn(matomo, 'getMatomoTracker').mockReturnValue({
			trackEvent: () => undefined,
			trackPageView,
			setCustomUrl: () => undefined
		});
		const tracker = new Tracker(1);
		tracker.trackPageView('title');
		expect(trackPageView).not.toHaveBeenCalled();
	});

	it('should call trackPageView when Tracker.isEnabled is true', () => {
		const trackPageView = jest.fn();
		const setCustomUrl = jest.fn();
		jest.spyOn(matomo, 'getMatomoTracker').mockReturnValue({
			trackEvent: () => undefined,
			trackPageView,
			setCustomUrl
		});
		Tracker.enableTracker(true);
		const tracker = new Tracker(1);
		tracker.trackPageView('title');
		expect(trackPageView).toHaveBeenCalled();
		expect(setCustomUrl).toHaveBeenCalled();
	});

	it('should not call trackEvent when Tracker.isEnabled is false(default)', () => {
		const trackEvent = jest.fn();
		jest.spyOn(matomo, 'getMatomoTracker').mockReturnValue({
			trackEvent,
			trackPageView: () => undefined,
			setCustomUrl: () => undefined
		});
		const tracker = new Tracker(1);
		tracker.trackEvent('category', 'action');
		expect(trackEvent).not.toHaveBeenCalled();
	});

	it('should call trackEvent when Tracker.isEnabled is true', () => {
		const trackEvent = jest.fn();
		const setCustomUrl = jest.fn();
		jest.spyOn(matomo, 'getMatomoTracker').mockReturnValue({
			trackEvent,
			trackPageView: () => undefined,
			setCustomUrl
		});
		Tracker.enableTracker(true);
		const tracker = new Tracker(1);
		tracker.trackEvent('category', 'action');
		expect(trackEvent).toHaveBeenCalled();
		expect(setCustomUrl).toHaveBeenCalled();
	});

	it('should call init only when tracker is enabled', () => {
		const initMatomoSpy = jest.spyOn(matomo, 'initMatomo');
		// eslint-disable-next-line @typescript-eslint/no-unused-vars,unused-imports/no-unused-vars
		const tracker = new Tracker(1);
		expect(initMatomoSpy).not.toHaveBeenCalled();
		Tracker.enableTracker(true);
		expect(initMatomoSpy).toHaveBeenCalled();
	});
});
