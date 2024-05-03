/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export type StringOfLength<Min, Max = Min> = string & {
	min: Min;
	max: Max;
	readonly StringOfLength: unique symbol; // this is the phantom type
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
	{
		[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
	}[Keys];

export type Override<
	TObj extends Record<string, unknown>,
	TOverride extends Partial<Record<keyof TObj, unknown>>
> = Omit<TObj, keyof TOverride> & TOverride;

// FIXME: check if there is a way to remove these any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;

export type ValueOf<T extends Record<string, unknown>> = T[keyof T];

export type Exactify<T, X extends T> = T & {
	[K in keyof X]: K extends keyof T ? X[K] : never;
};
