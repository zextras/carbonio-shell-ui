/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useEffect } from 'react';

import { EventBus } from '../../event-bus/event-bus';
import { useAccountStore } from '../../store/account';
import type { AccountSettings } from '../../types/account';

function isSettingsObject(payload: unknown): payload is Partial<AccountSettings> {
	return (
		typeof payload === 'object' &&
		payload !== null &&
		('prefs' in payload || 'props' in payload || 'attrs' in payload)
	);
}

export const useAccountSettingsListener = (): void => {
	useEffect(() => {
		const unsubscribe = EventBus.subscribe('update-settings', (payload) => {
			if (isSettingsObject(payload)) {
				useAccountStore.setState((s) => ({
					...s,
					settings: {
						...s.settings,
						...payload
					}
				}));
			}
		});

		return (): void => {
			unsubscribe();
		};
	}, []);
};
