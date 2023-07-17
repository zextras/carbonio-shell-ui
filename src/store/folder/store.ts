/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { create } from 'zustand';

import type { FolderState } from '../../../types';
import { folderWorker } from '../../workers';

// extra currying as suggested in https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#basic-usage
export const useFolderStore = create<FolderState>()(() => ({
	folders: {},
	roots: {},
	searches: {}
}));

folderWorker.onmessage = ({ data }): void => {
	useFolderStore.setState(data);
};
