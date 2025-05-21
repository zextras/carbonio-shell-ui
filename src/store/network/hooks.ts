/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useInfoRefresh, useSync } from '@zextras/carbonio-ui-soap-lib';

import type { SoapNotify, SoapRefresh } from '../../types/network';

export const useNotify = (): SoapNotify[] => useSync();

export const useRefresh = (): SoapRefresh => useInfoRefresh();
