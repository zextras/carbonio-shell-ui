/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import create from 'zustand';
import { FolderState } from '../../../types';
import { folderWorker } from '../../workers';

export const useFolderStore = create<FolderState>(() => ({
	folders: {},
	roots: {},
	searches: {}
}));

folderWorker.onmessage = ({ data }): void => {
	useFolderStore.setState(data);
};
