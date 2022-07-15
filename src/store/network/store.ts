/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import create from 'zustand';
import { NetworkState } from '../../../types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const useNetworkStore = create<NetworkState>(() => ({
	pollingInterval: 30000,
	seq: 0
}));
