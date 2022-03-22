/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { SoapNotify, SoapRefresh } from '../../../types';
import { useNetworkStore } from './store';

export const useNotify = (): SoapNotify[] => {
	const notify = useNetworkStore((s) => s.context.notify ?? []);
	return notify;
};
export const useRefresh = (): SoapRefresh => useNetworkStore((s) => s.context.refresh ?? {});
