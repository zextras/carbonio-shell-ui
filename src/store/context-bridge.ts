/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { reduce } from 'lodash';
import { create } from 'zustand';

import { AnyFunction } from '../utils/typeUtils';

export type PackageDependentFunction = (app: string) => AnyFunction;

export type ContextBridgeState = {
	packageDependentFunctions: Record<string, PackageDependentFunction>;
	functions: Record<string, AnyFunction>;
};

export type ContextBridgeActions = {
	add: (content: Partial<ContextBridgeState>) => void;
};

const initialState: ContextBridgeState = {
	packageDependentFunctions: {},
	functions: {}
};

// extra currying as suggested in https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#basic-usage
export const useContextBridge = create<ContextBridgeState & ContextBridgeActions>()((set) => ({
	...initialState,
	add: ({ packageDependentFunctions, functions }): void => {
		set((s) => ({
			packageDependentFunctions: reduce(
				packageDependentFunctions ?? {},
				(acc, f, key) => {
					// eslint-disable-next-line no-param-reassign
					acc[key] = f;
					return acc;
				},
				s.packageDependentFunctions
			),
			functions: reduce(
				functions ?? {},
				(acc, f, key) => {
					// eslint-disable-next-line no-param-reassign
					acc[key] = f;
					return acc;
				},
				s.functions
			)
		}));
	}
}));

export const useBridge = useContextBridge.getState().add;
