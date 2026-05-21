/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DEFAULT_LOCALES } from './default-locales';

export const FALLBACK_SUPPORTED_LOCALES = ['en'];

export const parseSupportedLocalesManifest = (manifest: unknown): Array<string> => {
	if (!Array.isArray(manifest) || !manifest.every((localeCode) => typeof localeCode === 'string')) {
		return FALLBACK_SUPPORTED_LOCALES;
	}

	const knownLocaleCodes = manifest.filter((localeCode) => DEFAULT_LOCALES[localeCode]);

	if (knownLocaleCodes.length === 0) {
		return FALLBACK_SUPPORTED_LOCALES;
	}

	return knownLocaleCodes;
};

const getSupportedLocalesPath = (): string => `${BASE_PATH}/i18n/supported-locales.json`;

export const loadSupportedLocales = async (): Promise<Array<string>> => {
	try {
		const response = await fetch(getSupportedLocalesPath());

		if (!response.ok) {
			return FALLBACK_SUPPORTED_LOCALES;
		}

		return parseSupportedLocalesManifest(await response.json());
	} catch {
		return FALLBACK_SUPPORTED_LOCALES;
	}
};
