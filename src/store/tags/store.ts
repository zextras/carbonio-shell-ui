/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import create from 'zustand';
import { TagState } from '../../../types';
import { tagWorker } from '../../workers';

export const useTagStore = create<TagState>(() => ({
	tags: {}
}));

tagWorker.onmessage = ({ data }): void => {
	useTagStore.setState(data);
};
