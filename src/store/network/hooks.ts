/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useNetworkStore } from './store';
import type { SoapNotify, SoapRefresh } from '../../../types';

export const useNotify = (): SoapNotify[] => useNetworkStore((s) => s.notify ?? []);
export const useRefresh = (): SoapRefresh => useNetworkStore((s) => s.refresh ?? {});
