/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { StateCreator, StoreApi, UseBoundStore } from 'zustand';
import { act } from '@testing-library/react';

const { create: actualCreate } = jest.requireActual<typeof import('zustand')>('zustand');

// a variable to hold reset functions for all stores declared in the app
const storeResetFns = new Set<() => void>();

// when creating a store, we get its initial state, create a reset function and add it in the set
export const create =
	<S>() =>
	(actualCreateState: StateCreator<S>): UseBoundStore<StoreApi<S>> => {
		const createState: StateCreator<S> = (setState, getState, store) => {
			const state = actualCreateState(setState, getState, store);
			storeResetFns.add(() => store.setState(actualCreateState(setState, getState, store), true));
			return state;
		};
		return actualCreate(createState);
	};

// Reset all stores after each test run
beforeEach(() => {
	act(() => storeResetFns.forEach((resetFn) => resetFn()));
});

export default create;
