/* eslint-disable @typescript-eslint/ban-types */
import create from 'zustand';
import createStore from 'zustand/vanilla';
import { reduce } from 'lodash';
import { useEffect } from 'react';

export type PackageDependentFunction = (pkg: string) => Function;

export type ContextBridgeState = {
	packageDependentFunctions: Record<string, PackageDependentFunction>;
	functions: Record<string, Function>;
	add: (content: Omit<ContextBridgeState, 'add'>) => void;
};

export const contextBridge = createStore<ContextBridgeState>((set, get) => ({
	packageDependentFunctions: {},
	functions: {},
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

export const _useContextBridge = create(contextBridge);

export const useContextBridge = (content: Omit<ContextBridgeState, 'add'>): void => {
	const addFunctions = _useContextBridge(({ add }) => add);
	useEffect(() => {
		addFunctions(content);
	}, [content, addFunctions]);
};
