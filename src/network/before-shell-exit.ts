/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

type BeforeShellExitListener = () => void;

const listeners = new Set<BeforeShellExitListener>();

/**
 * Subscribe to the notification emitted right before the shell deliberately
 * navigates away from the page (logout, expired session, redirect to login).
 * The listeners are invoked synchronously, so they can release whatever
 * would prevent or delay the navigation (e.g. a beforeunload handler).
 *
 * @returns the function to unsubscribe the listener
 */
export function onBeforeShellExit(listener: BeforeShellExitListener): () => void {
	listeners.add(listener);
	return (): void => {
		listeners.delete(listener);
	};
}

export function notifyBeforeShellExit(): void {
	[...listeners].forEach((listener) => {
		try {
			listener();
		} catch (error) {
			console.error(error);
		}
	});
}
