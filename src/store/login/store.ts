/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import create from 'zustand';
import { LoginConfigStore } from '../../../types/loginConfig';

export const useLoginConfigStore = create<LoginConfigStore>(() => ({}));
