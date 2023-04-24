/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { create } from 'zustand';
import type { TagState } from '../../../types';
import { tagWorker } from '../../workers';

// extra currying as suggested in https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#basic-usage
export const useTagStore = create<TagState>()(() => ({
	tags: {}
}));

tagWorker.onmessage = ({ data }): void => {
	useTagStore.setState(data);
};
