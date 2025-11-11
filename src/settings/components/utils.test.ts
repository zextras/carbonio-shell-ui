/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import type { GeneralizedTime } from '@zextras/carbonio-ui-soap-lib';

import {
	dateToGenTime,
	genTimeToDate,
	humanFileSize,
	asArray,
	getAvailableEmailAddresses
} from './utils';
import type { Account, AccountSettings } from '../../lib';
import { createAccount, createIdentity } from '../../tests/account-utils';

describe('dateToGenTime function', () => {
	it('should return a UTC date with the format YYYYMMDDHHmmss[Z]', () => {
		const date = new Date(2024, 4, 20, 15, 22, 45, 0);
		const offset = date.getTimezoneOffset();
		const dateUTC = new Date(date.getTime() - offset * 60 * 1000);
		expect(dateToGenTime(dateUTC)).toBe('20240520152245Z');
	});
});

describe('genTimeToDate function', () => {
	it('should return a date starting from a valid string with format YYYYMMDDHHmmss[Z]', () => {
		const dateStr = '20240520152245Z' as GeneralizedTime;
		const date = new Date(2024, 4, 20, 15, 22, 45, 0);
		const offset = date.getTimezoneOffset();
		const dateUTC = new Date(date.getTime() - offset * 60 * 1000);
		expect(genTimeToDate(dateStr)).toEqual(dateUTC);
	});

	it('should return a date starting from a valid string with format YYYYMMDDHHmmss.SSS[Z]', () => {
		const dateStr = '20240520152245.123Z' as GeneralizedTime;
		const date = new Date(2024, 4, 20, 15, 22, 45, 0);
		const offset = date.getTimezoneOffset();
		const dateUTC = new Date(date.getTime() - offset * 60 * 1000);
		expect(genTimeToDate(dateStr)).toEqual(dateUTC);
	});
});

describe('humanFileSize function', () => {
	it('should return 0 B if input is 0', () => {
		const result = humanFileSize(0, undefined);
		expect(result).toBe('0 B');
	});

	it('should return 8.00 PB if input is max safe integer', () => {
		const result = humanFileSize(Number.MAX_SAFE_INTEGER, undefined);
		expect(result).toBe('8.00 PB');
	});

	it.each([
		['B', 0],
		['KB', 1],
		['MB', 2],
		['GB', 3],
		['TB', 4],
		['PB', 5],
		['EB', 6],
		['ZB', 7],
		['YB', 8]
	])('should return %s unit if input pow is %s', (unit, pow) => {
		const result = humanFileSize(1024 ** pow, undefined);
		expect(result).toBe(`1.00 ${unit}`);
	});

	it.each([
		['B', 1],
		['KB', 2],
		['MB', 3],
		['GB', 4],
		['TB', 5],
		['PB', 6],
		['EB', 7],
		['ZB', 8]
	])(
		'should return %s unit measure if input is one unit lower than the next unit measure',
		(unit, pow) => {
			const result = humanFileSize(1024 ** pow - 1024 ** (pow - 1), undefined);
			expect(result).toBe(`1023.00 ${unit}`);
		}
	);

	it('should change unit from KB to B when removing 1 B from 1024 B', () => {
		expect(humanFileSize(1024 - 1, undefined)).toBe('1023.00 B');
	});

	it.each([
		['KB', 2],
		['MB', 3],
		['GB', 4]
	])('should return 1024.00 %s if input is 1024 ** %s - 1', (unit, pow) => {
		const result = humanFileSize(1024 ** pow - 1, undefined);
		expect(result).toBe(`1024.00 ${unit}`);
	});

	it.each([
		['PB', 5],
		['EB', 6],
		['ZB', 7],
		['YB', 8]
	])('should return %s unit if input pow is %s - 1B', (unit, pow) => {
		const result = humanFileSize(1024 ** pow - 1, undefined);
		expect(result).toBe(`1.00 ${unit}`);
	});

	it('should throw an error if inputSize is equal or greater than 1024 YB', () => {
		expect(() => humanFileSize(1024 ** 9, undefined)).toThrow('Unsupported inputSize');
	});
});

describe('asArray', () => {
	it('should return an array when the value is an array', () => {
		const result = asArray(['value1', 'value2']);
		expect(result).toEqual(['value1', 'value2']);
	});

	it('should return an array when the value is a single value', () => {
		const result = asArray('singleValue');
		expect(result).toEqual(['singleValue']);
	});

	it('should return an empty array when the value is undefined', () => {
		const result = asArray(undefined);
		expect(result).toEqual([]);
	});

	it('should return array of numbers', () => {
		const result = asArray(123);
		expect(result).toEqual([123]);
	});
});

describe('getAvailableEmailAddresses', () => {
	const defaultId = faker.string.uuid();

	const baseAccount: Account = createAccount('default@email.com', defaultId, [
		createIdentity(
			{
				zimbraPrefIdentityId: defaultId,
				zimbraPrefIdentityName: 'defaultFullName',
				zimbraPrefFromAddress: 'default@email.com'
			},
			true
		)
	]);

	const baseSettings: AccountSettings = { prefs: {}, attrs: {}, props: [] };

	it('should return the primary account email by default', () => {
		const result = getAvailableEmailAddresses(baseAccount, baseSettings);
		expect(result).toEqual(['default@email.com']);
	});

	it('should include shared emails when rights and types match', () => {
		const d = faker.string.alpha();
		const id = faker.string.alpha();
		const name = faker.string.alpha();
		const account: Account = {
			...baseAccount,
			rights: {
				targets: [
					{
						right: 'sendAs',
						target: [
							{ type: 'account', email: [{ addr: 'shared1@domain.com' }], d, id, name },
							{ type: 'dl', email: [{ addr: 'dl1@domain.com' }], d, id, name }
						]
					},
					{
						right: 'sendOnBehalfOfDistList',
						target: [{ type: 'account', email: [{ addr: 'shared2@domain.com' }], d, id, name }]
					}
				]
			}
		};

		const result = getAvailableEmailAddresses(account, baseSettings);
		expect(result).toContain('shared1@domain.com');
		expect(result).toContain('dl1@domain.com');
		expect(result).toContain('shared2@domain.com');
	});

	it('should ignore shared emails if the right is not authorized', () => {
		const d = faker.string.alpha();
		const id = faker.string.alpha();
		const name = faker.string.alpha();

		const account: Account = {
			...baseAccount,
			rights: {
				targets: [
					{
						right: 'viewFreeBusy',
						target: [{ type: 'account', email: [{ addr: 'ignored@domain.com' }], d, id, name }]
					}
				]
			}
		};

		const result = getAvailableEmailAddresses(account, baseSettings);
		expect(result).not.toContain('ignored@domain.com');
	});

	it('should include aliases and allow-from addresses from settings', () => {
		const settings = {
			...baseSettings,
			attrs: {
				zimbraMailAlias: 'alias@domain.com',
				zimbraAllowFromAddress: ['allowed@domain.com', 'extra@domain.com']
			}
		};

		const result = getAvailableEmailAddresses(baseAccount, settings);
		expect(result).toContain('alias@domain.com');
		expect(result).toContain('allowed@domain.com');
		expect(result).toContain('extra@domain.com');
	});

	it('should return a unique list (remove duplicates)', () => {
		const d = faker.string.alpha();
		const id = faker.string.alpha();
		const name = faker.string.alpha();
		const account: Account = {
			...baseAccount,
			rights: {
				targets: [
					{
						right: 'sendAs',
						target: [{ type: 'account', email: [{ addr: 'default@email.com' }], d, id, name }]
					}
				]
			}
		};

		const settings = {
			...baseSettings,
			attrs: {
				zimbraMailAlias: ['default@email.com'],
				zimbraAllowFromAddress: []
			}
		};

		const result = getAvailableEmailAddresses(account, settings);

		expect(result).toEqual(['default@email.com']);
		expect(result).toHaveLength(1);
	});
});
