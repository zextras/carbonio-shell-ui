/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { create } from 'zustand';

import type { UtilityBarStore } from '../types/misc';

// extra currying as suggested in https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#basic-usage
export const useUtilityBarStore = create<UtilityBarStore>()((set) => ({
	mode: 'closed',
	current: undefined,
	isSecondaryBarForcedCollapsed: false,
	// the secondary bar is collapsed only while the utility panel is open
	setMode: (mode): void => set({ mode, isSecondaryBarForcedCollapsed: mode === 'open' }),
	setCurrent: (current): void => set({ current }),
	setIsSecondaryBarForcedCollapsed: (isSecondaryBarForcedCollapsed: boolean): void =>
		set({ isSecondaryBarForcedCollapsed })
}));
