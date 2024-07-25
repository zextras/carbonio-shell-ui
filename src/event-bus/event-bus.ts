/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

function assert(condition: unknown, msg?: string): asserts condition {
	if (!condition) {
		throw new Error(msg ?? 'condition is falsy');
	}
}
type Subscriber = (data: unknown) => void;

type UnsubscribeFn = () => void;

export const EventBus = ((): {
	subscribe: (event: string, callback: Subscriber) => UnsubscribeFn;
	notify: (event: string, data: unknown) => void;
	getLastEvent: (event: string) => unknown;
} => {
	const subscriptions = new Map<string, Subscriber[]>();
	const eventHistory = new Map<string, unknown>();

	function subscribe(event: string, callback: (data: unknown) => void): () => void {
		if (!subscriptions.has(event)) {
			subscriptions.set(event, []);
		}
		const subscribers = subscriptions.get(event);
		assert(subscribers !== undefined);
		subscribers.push(callback);

		return () => {
			subscribers.splice(subscribers.indexOf(callback), 1);
			if ((subscriptions.get(event) ?? []).length === 0) {
				subscriptions.delete(event);
			}
		};
	}

	function notify(event: string, data: unknown): void {
		eventHistory.set(event, data);
		const subscribers = subscriptions.get(event);
		subscribers?.forEach((subscriber) => {
			subscriber(data);
		});
	}

	function getLastEvent(event: string): unknown {
		return eventHistory.get(event);
	}

	return {
		subscribe,
		notify,
		getLastEvent
	};
})();
