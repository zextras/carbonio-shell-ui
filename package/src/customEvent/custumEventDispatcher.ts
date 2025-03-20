/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const ApiEvents = {
	UserQuota: 'UserQuotaEvent',
	Notify: 'NotifyEvent',
	AuthError: 'AuthErrorEvent'
} as const;

export type UserQuotaEvent = {
	name: typeof ApiEvents.UserQuota;
	payload: {
		quota: number
	}
}

export type NotifyEvent = {
	name: typeof ApiEvents.Notify,
	payload: {
		quota: number
	}
}

export type AuthErrorEvent = {
	name: typeof ApiEvents.AuthError,
	payload: {
		error: 'NOT_AUTHENTICATED'
	}
}

type ApiEvent = UserQuotaEvent | NotifyEvent | AuthErrorEvent;

const dispatchCustomEvent = (event: ApiEvent): void => {
	window.dispatchEvent(new CustomEvent(event.name, { detail: event.payload }));
};

export const dispatchUserQuotaEvent = (quota: number): void => {
	dispatchCustomEvent({ name: ApiEvents.UserQuota, payload: { quota } });
};

export const dispatchNotifyEvent = (quota: number): void => {
	dispatchCustomEvent({ name: ApiEvents.Notify, payload: { quota } });
};

export const dispatchAuthErrorEvent = (error: 'NOT_AUTHENTICATED'): void => {
	dispatchCustomEvent({ name: ApiEvents.AuthError, payload: { error } });
};
