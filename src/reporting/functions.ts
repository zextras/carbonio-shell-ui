/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { Event, EventHint } from '@sentry/browser';
import { useReporter } from './store';

export const report =
	(appId: string) =>
	(error: Event, hint?: EventHint): string => {
		const reporter = useReporter.getState();
		const eventId = reporter.clients[appId]?.captureException(error, { ...hint });
		if (eventId) {
			console.info('Reported event ', eventId);
		}
		return eventId;
	};

export const feedback = (message: Event): string => {
	const reporter = useReporter.getState();
	const eventId = reporter.clients.feedbacks.captureEvent({ ...message, level: 'info' });
	if (eventId) {
		console.info('Feedback ', eventId, ' sent, Thank you');
	}
	return eventId;
};
