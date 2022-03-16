/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Tag, Tags } from '../../../types';
import { useTagStore } from './store';

/* eslint-disable react-hooks/rules-of-hooks */
/* THIS FILE CONTAINS HOOKS, BUT ESLINT IS DUMB */

export const useTag = (id: string): Tag => useTagStore((s) => s.tags[id]);
export const getTag = (id: string): Tag => useTagStore.getState().tags[id];
export const useTags = (): Tags => useTagStore((s) => s.tags);
export const getTags = (): Tags => useTagStore.getState().tags;
