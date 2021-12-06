/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import UAParser from 'ua-parser-js';

const { os, browser } = UAParser();
export const userAgent = `CarbonioWebClient - ${browser.name} ${browser.version} (${os.name})`;
