/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { NotifyObject } from '../../../types';
import { useNetworkStore } from './store';

export const useNotify = (): NotifyObject[] => {
	const notify = useNetworkStore((s) => s.context.notify ?? []);
	return notify;
};
export const useRefresh = (): NotifyObject => useNetworkStore((s) => s.context.refresh ?? {});
