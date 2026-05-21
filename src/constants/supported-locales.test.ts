/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { http, HttpResponse } from 'msw';

import { localeList } from './locales';
import {
	FALLBACK_SUPPORTED_LOCALES,
	loadSupportedLocales,
	parseSupportedLocalesManifest
} from './supported-locales';
import server from '../mocks/server';
import { useI18nStore } from '../store/i18n/store';

describe('supported locales', () => {
	const { defaultI18n } = useI18nStore.getState();

	test('filters out unknown locale codes from the manifest', () => {
		expect(parseSupportedLocalesManifest(['en', 'unknown', 'id'])).toEqual(['en', 'id']);
	});

	test('falls back to english when the manifest is malformed', () => {
		expect(parseSupportedLocalesManifest({ en: true })).toEqual(FALLBACK_SUPPORTED_LOCALES);
	});

	test('falls back to english when the manifest does not contain known locales', () => {
		expect(parseSupportedLocalesManifest(['unknown'])).toEqual(FALLBACK_SUPPORTED_LOCALES);
	});

	test('builds a filtered alphabetically sorted locale list', () => {
		expect(localeList(defaultI18n.t, ['it', 'en', 'id']).map(({ value }) => value)).toEqual([
			'en',
			'id',
			'it'
		]);
	});

	test('loads supported locales from the runtime manifest', async () => {
		server.use(
			http.get('/i18n/supported-locales.json', () => HttpResponse.json(['id', 'unknown', 'en']))
		);

		await expect(loadSupportedLocales()).resolves.toEqual(['id', 'en']);
	});

	test('falls back to english when the runtime manifest is not available', async () => {
		server.use(http.get('/i18n/supported-locales.json', () => HttpResponse.error()));

		await expect(loadSupportedLocales()).resolves.toEqual(FALLBACK_SUPPORTED_LOCALES);
	});
});
