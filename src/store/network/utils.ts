/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { forEach } from 'lodash';

import { useNetworkStore } from './store';
import type { AccountSettings } from '../../types/account';
import type { RawSoapResponse, SoapContext } from '../../types/network';
import { folderWorker, tagWorker } from '../../workers';
import { useAccountStore } from '../account';
import { useFolderStore } from '../folder';
import { useTagStore } from '../tags';

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

export const parsePollingInterval = (settings: AccountSettings): number => {
	const pollingPref = settings.prefs?.zimbraPrefMailPollingInterval ?? '';
	if (pollingPref === '500') {
		return 500;
	}
	const pollingValue = parseInt(pollingPref, 10);
	if (Number.isNaN(pollingValue)) {
		return 30000;
	}
	if (pollingPref.includes('m')) {
		return pollingValue * 60 * 1000;
	}
	return pollingValue * 1000;
};

/**
 * Return the polling interval for the next NoOp request.
 * The interval length depends on the user settings, but it can be
 * overridden by the server response/errors
 * @param res
 */
export const getPollingInterval = (res: RawSoapResponse<{ waitDisallowed?: number }>): number => {
	const { pollingInterval } = useNetworkStore.getState();
	const { settings } = useAccountStore.getState();
	const waitDisallowed = res.Body && !('Fault' in res.Body) && res.Body.waitDisallowed;
	const fault = res.Body && 'Fault' in res.Body && res.Body.Fault;
	if (fault) {
		return POLLING_RETRY_INTERVAL;
	}
	if (waitDisallowed) {
		return POLLING_NOWAIT_INTERVAL;
	}
	if (!fault) {
		return parsePollingInterval(settings);
	}
	return pollingInterval;
};

export const handleSync = ({ refresh, notify }: SoapContext): Promise<void> =>
	new Promise((r) => {
		const { seq } = useNetworkStore.getState();
		if (refresh) {
			tagWorker.postMessage({
				op: 'refresh',
				tags: refresh.tags
			});
			folderWorker.postMessage({
				op: 'refresh',
				folder: refresh.folder ?? []
			});
		}
		if (notify?.length) {
			forEach(notify, (item) => {
				if (item.seq > seq) {
					tagWorker.postMessage({
						op: 'notify',
						notify: item,
						state: useTagStore.getState().tags
					});
					folderWorker.postMessage({
						op: 'notify',
						notify: item,
						state: useFolderStore.getState().folders
					});
				}
			});
		}
		r();
	});
