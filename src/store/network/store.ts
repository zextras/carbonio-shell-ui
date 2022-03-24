/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import create, { StoreApi, UseBoundStore } from 'zustand';
import { NetworkState } from '../../../types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const useNetworkStore = create<NetworkState>(() => ({
	noOpTimeout: undefined,
	context: {},
	pollingInterval: 30000
})) as UseBoundStore<NetworkState, StoreApi<NetworkState>>;
