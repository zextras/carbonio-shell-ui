/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export type OneOrMany<T> = T | T[];

export type StringOfLength<Min, Max = Min> = string & {
	min: Min;
	max: Max;
	readonly StringOfLength: unique symbol; // this is the phantom type
};

// This is a type guard function which can be used to assert that a string
// is of type StringOfLength<Min,Max>
export const isStringOfLength = <Min extends number, Max extends number>(
	str: string,
	min: Min,
	max: Max
): str is StringOfLength<Min, Max> => str.length >= min && str.length <= max;

// type constructor function
export const stringOfLength = <Min extends number, Max extends number>(
	input: unknown,
	min: Min,
	max: Max
): StringOfLength<Min, Max> => {
	if (typeof input !== 'string') {
		throw new Error('invalid input');
	}

	if (!isStringOfLength(input, min, max)) {
		throw new Error('input is not between specified min and max');
	}

	return input; // the type of input here is now StringOfLength<Min,Max>
};

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
	{
		[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
	}[Keys];
