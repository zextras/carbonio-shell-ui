/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useNetworkStore } from './store';
import type { SoapNotify, SoapRefresh } from '../../types/network';

const FALLBACK_NOTIFY: SoapNotify[] = [];
const FALLBACK_REFRESH: SoapRefresh = {};
export const useNotify = (): SoapNotify[] => useNetworkStore((s) => s.notify ?? FALLBACK_NOTIFY);
export const useRefresh = (): SoapRefresh => useNetworkStore((s) => s.refresh ?? FALLBACK_REFRESH);
