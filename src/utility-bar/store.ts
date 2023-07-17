/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { create } from 'zustand';

import type { UtilityBarStore } from '../../types';

// extra currying as suggested in https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#basic-usage
export const useUtilityBarStore = create<UtilityBarStore>()((set) => ({
	mode: 'closed',
	current: undefined,
	secondaryBarState: true,
	setMode: (mode): void =>
		set((s) => ({ mode, secondaryBarState: mode === 'open' ? false : s.secondaryBarState })),
	setCurrent: (current): void => set({ current }),
	setSecondaryBarState: (secondaryBarState: boolean): void => set({ secondaryBarState })
}));
