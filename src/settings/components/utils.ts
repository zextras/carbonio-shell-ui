/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type React from 'react';

import type { GeneralizedTime } from '@zextras/carbonio-ui-soap-lib';
import type { TFunction } from 'i18next';
import { cloneDeep, filter, findIndex, isBoolean, reduce, uniq } from 'lodash';

import { BASE_FONT_SIZE, SCALING_LIMIT, SCALING_OPTIONS } from '../../constants';
import type {
	Account,
	AccountSettings,
	BooleanString,
	Identity,
	IdentityAttrs
} from '../../types/account';
import type { AddMod, PrefsMods } from '../../types/network';

export function dateToGenTime(date: Date): GeneralizedTime {
	return `${
		date.getUTCFullYear() +
		(date.getUTCMonth() + 1).toString().padStart(2, '0') +
		date.getUTCDate().toString().padStart(2, '0') +
		date.getUTCHours().toString().padStart(2, '0') +
		date.getUTCMinutes().toString().padStart(2, '0') +
		date.getUTCSeconds().toString().padStart(2, '0')
	}Z` as GeneralizedTime;
}

export function genTimeToDate(genTime: GeneralizedTime): Date {
	const date = new Date();
	date.setUTCFullYear(Number(genTime.substring(0, 4)));
	date.setUTCMonth(Number(genTime.substring(4, 6)) - 1);
	date.setUTCDate(Number(genTime.substring(6, 8)));
	date.setUTCHours(Number(genTime.substring(8, 10)));
	date.setUTCMinutes(Number(genTime.substring(10, 12)));
	date.setUTCSeconds(Number(genTime.substring(12, 14)));
	date.setUTCMilliseconds(0);
	return date;
}

export const startOfDay = (date: Date): Date => {
	const newDate = new Date(date);
	newDate.setHours(0, 0, 0, 0);
	return newDate;
};

export const endOfDay = (date: Date): Date => {
	const newDate = new Date(date);
	newDate.setHours(23, 59, 59, 0);
	return newDate;
};

export const getAutoScalingFontSize = (): number => {
	if (
		window.screen.width <= SCALING_LIMIT.width &&
		window.screen.height <= SCALING_LIMIT.height &&
		window.devicePixelRatio >= SCALING_LIMIT.dpr
	) {
		const baseFontIndex = SCALING_OPTIONS.findIndex((option) => option.value === BASE_FONT_SIZE);
		if (baseFontIndex > 0) {
			return SCALING_OPTIONS[baseFontIndex - 1].value;
		}
	}
	return BASE_FONT_SIZE;
};

export type ResetComponentImperativeHandler = { reset: () => void };

type UpsertPrefOnUnsavedChangesFn = <K extends keyof PrefsMods>(
	prefKey: K,
	prefValue: PrefsMods[K] extends BooleanString | undefined ? boolean | undefined : PrefsMods[K]
) => void;

export function upsertPrefOnUnsavedChanges(
	addModifiedValueCallback: AddMod
): UpsertPrefOnUnsavedChangesFn {
	return (prefKey, prefValue) => {
		if (prefValue === undefined) {
			addModifiedValueCallback('prefs', prefKey, '');
		} else if (isBoolean(prefValue)) {
			addModifiedValueCallback('prefs', prefKey, (prefValue && 'TRUE') || 'FALSE');
		} else {
			addModifiedValueCallback('prefs', prefKey, prefValue as PrefsMods[typeof prefKey]);
		}
	};
}

export type SettingsSectionProps = {
	resetRef?: React.Ref<ResetComponentImperativeHandler>;
};

export function isPrimary(identity: Identity): boolean {
	return identity.name === 'DEFAULT';
}

export function defaultAsFirstOrderIdentities(identities: Array<Identity>): Array<Identity> {
	const defaultIdx = identities.findIndex(isPrimary);
	const result = cloneDeep(identities);
	const defaultIdentity = result.splice(defaultIdx, 1);
	result.unshift(defaultIdentity[0]);
	return result;
}

/**
 * Wraps a given value in an array if it is not already an array.
 *
 * @template T - The type of the input value.
 * @param {T | T[] | undefined} value - The value to be transformed. Can be a single value of type `T`,
 * an array of `T`, or `undefined`.
 * @returns {T[]} - Returns an array of `T`. If `value` is an array, it is returned as-is. If `value`
 * is a single item, it is wrapped in an array. If `value` is `undefined`, returns an empty array.
 *
 * @example
 * asArray(5); // returns [5]
 * asArray([5, 6]); // returns [5, 6]
 * asArray(undefined); // returns []
 */
export function asArray<T>(value: T | T[] | undefined): T[] {
	if (value !== undefined) {
		if (Array.isArray(value)) {
			return value;
		}
		return [value];
	}
	return [];
}

/**
 * Compose a unique list of all identities' email addresses
 *
 * The list is composed of:
 * - the email address of the current account
 * - the email addresses of all the shared accounts (taken from the rights infos)
 * - all the aliases
 * - all the email addresses from zimbraAllowFromAddress
 *
 * @param account
 * @param settings
 *
 * @returns a list of unique email addresses
 */
export const getAvailableEmailAddresses = (
	account: Account,
	settings: AccountSettings
): string[] => {
	const result: string[] = [];

	// Adds the email address of the primary account
	result.push(account.name);

	// Adds the email addresses of all the shared accounts
	if (account.rights?.targets) {
		account.rights?.targets.forEach((target) => {
			if (
				target.target &&
				(target.right === 'sendAs' ||
					target.right === 'sendOnBehalfOf' ||
					target.right === 'sendAsDistList' ||
					target.right === 'sendOnBehalfOfDistList')
			) {
				target.target.forEach((user) => {
					if ((user.type === 'account' || user.type === 'dl') && user.email) {
						user.email.forEach((email) => {
							result.push(email.addr);
						});
					}
				});
			}
		});
	}

	result.push(
		...asArray(settings.attrs.zimbraMailAlias),
		...asArray(settings.attrs.zimbraAllowFromAddress)
	);

	return uniq(result);
};

export function calculateNewIdentitiesState(
	currentIdentities: Array<Identity>,
	deletedIdentities: Array<string>,
	addedIdentities: Array<Identity>,
	modifiedIdentitiesAttrs: Record<string, Partial<IdentityAttrs>>
): Array<Identity> {
	const filteredIdentities = filter(
		currentIdentities,
		(item) => !deletedIdentities.includes(item.id)
	);

	const filteredAndModified = reduce(
		modifiedIdentitiesAttrs,
		(accumulator, attrs, id) => {
			const propIndex = findIndex(accumulator, (identity) => identity.id === id);
			if (propIndex > -1) {
				accumulator[propIndex]._attrs = {
					...accumulator[propIndex]._attrs,
					...attrs
				};
				if (attrs.zimbraPrefIdentityName && !isPrimary(accumulator[propIndex])) {
					accumulator[propIndex].name = attrs.zimbraPrefIdentityName;
				}
			}
			return accumulator;
		},
		filteredIdentities
	);

	filteredAndModified.splice(-1, 0, ...addedIdentities);
	return filteredAndModified;
}

/**
 * Format a size in byte as human-readable
 */
export const humanFileSize = (inputSize: number, t: TFunction | undefined): string => {
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	if (inputSize === 0) {
		const unit = units[0];
		const translatedUnit = t ? t('size.unitMeasure', { context: unit, defaultValue: unit }) : unit;
		return `0 ${translatedUnit}`;
	}
	const i = Math.floor(Math.log(inputSize) / Math.log(1024));
	if (i >= units.length) {
		throw new Error('Unsupported inputSize');
	}
	const unit = units[i];
	const unitTranslated = t ? t('size.unitMeasure', { context: unit, defaultValue: unit }) : unit;
	const size = (inputSize / 1024 ** i).toFixed(2).toString();
	return `${size} ${unitTranslated}`;
};
