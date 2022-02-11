/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import create from 'zustand';

type PanelMode = 'closed' | 'overlap' | 'open';
type UtilityBarStore = {
	mode: PanelMode;
	setMode: (mode: PanelMode) => void;
	current?: string;
	setCurrent: (current: string) => void;
	secondaryBarState: boolean;
	setSecondaryBarState: (state: boolean) => void;
};
export const useUtilityBarStore = create<UtilityBarStore>((set) => ({
	mode: 'closed',
	current: undefined,
	secondaryBarState: true,
	setMode: (mode): void =>
		set((s) => ({ mode, secondaryBarState: mode === 'open' ? false : s.secondaryBarState })),
	setCurrent: (current): void => set({ current }),
	setSecondaryBarState: (secondaryBarState: boolean): void => set({ secondaryBarState })
}));
