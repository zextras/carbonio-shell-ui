/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { AccountSettings } from '../../types/account';
import type { RawSoapResponse } from '../../types/network';
import { useAccountStore } from '../account';
import { NoOpResponse } from "../../../lib/network/fetch";

/**
 * Polling interval to use if the long polling delay
 * is not allowed for the user
 */
const POLLING_NOWAIT_INTERVAL = 10_000;

/**
 * Polling interval to use if a previous request failed
 * with a 500 error
 */
const POLLING_RETRY_INTERVAL = 60_000;

const POLLING_INVALID_DURATION = 30_000;

const LONG_POLLING_MARKER_VALUE = 500;

export const parsePollingInterval = (settings: AccountSettings): number => {
	const pollingPref = settings.prefs?.zimbraPrefMailPollingInterval ?? '';
	const [value, durationUnit] = pollingPref.split(/([a-z]+)/g);
	const pollingValue = parseInt(value, 10);
	if (Number.isNaN(pollingValue)) {
		return POLLING_INVALID_DURATION;
	}

	if (
		pollingValue === LONG_POLLING_MARKER_VALUE &&
		(durationUnit === undefined || durationUnit === 'ms' || durationUnit === 's')
	) {
		return LONG_POLLING_MARKER_VALUE;
	}
	switch (durationUnit) {
		case 'ms':
			return pollingValue;
		case undefined:
		case 's':
			return pollingValue * 1000;
		case 'm':
			return pollingValue * 60 * 1000;
		case 'h':
			return pollingValue * 60 * 60 * 1000;
		case 'd':
			return pollingValue * 24 * 60 * 60 * 1000;
		default:
			return POLLING_INVALID_DURATION;
	}
};

/**
 * Return the polling interval for the next NoOp request.
 * The interval length depends on the user settings, but it can be
 * overridden by the server response/errors
 */
export const getPollingInterval = (
	res: RawSoapResponse<{
		NoOpResponse?: NoOpResponse;
	}>
): number => {
	const { settings } = useAccountStore.getState();
	const waitDisallowed =
		res.Body && !('Fault' in res.Body) && res.Body.NoOpResponse?.waitDisallowed;
	const fault = res.Body && 'Fault' in res.Body && res.Body.Fault;
	if (fault) {
		return POLLING_RETRY_INTERVAL;
	}
	if (waitDisallowed) {
		return POLLING_NOWAIT_INTERVAL;
	}
	return parsePollingInterval(settings);
};
