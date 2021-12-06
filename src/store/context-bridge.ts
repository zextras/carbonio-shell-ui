/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/ban-types */
import create from 'zustand';
import createStore from 'zustand/vanilla';
import { reduce } from 'lodash';
import { useEffect } from 'react';
import { ContextBridgeState } from '../../types';

export const contextBridge = createStore<ContextBridgeState>((set, get) => ({
	packageDependentFunctions: {},
	routeDependentFunctions: {},
	functions: {},
	add: ({ packageDependentFunctions, routeDependentFunctions, functions }): void => {
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
			routeDependentFunctions: reduce(
				routeDependentFunctions ?? {},
				(acc, f, key) => {
					// eslint-disable-next-line no-param-reassign
					acc[key] = f;
					return acc;
				},
				s.routeDependentFunctions
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

export const _useContextBridge = create(contextBridge);

export const useContextBridge = (content: Omit<ContextBridgeState, 'add'>): void => {
	const addFunctions = _useContextBridge(({ add }) => add);
	useEffect(() => {
		addFunctions(content);
	}, [content, addFunctions]);
};
