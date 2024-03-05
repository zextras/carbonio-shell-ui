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

export type Override<
	TObj extends Record<string, unknown>,
	TOverride extends Partial<Record<keyof TObj, unknown>>
> = Omit<TObj, keyof TOverride> & TOverride;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any) => any;
