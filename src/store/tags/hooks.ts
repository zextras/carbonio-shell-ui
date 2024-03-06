/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { pick } from 'lodash';

import { useTagStore } from './store';
import type { Tags } from '../../types/tags';

/* eslint-disable react-hooks/rules-of-hooks */
/* THIS FILE CONTAINS HOOKS, BUT ESLINT IS DUMB */

export const useTags = (ids?: Array<string> | string): Tags =>
	useTagStore((s) => (ids ? pick(s.tags, ids) : s.tags));
export const getTags = (ids?: Array<string> | string): Tags =>
	ids ? pick(useTagStore.getState().tags, ids) : useTagStore.getState().tags;
