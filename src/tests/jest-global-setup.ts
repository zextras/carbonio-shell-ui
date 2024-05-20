/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
const globalSetup = async (): Promise<void> => {
	process.env.TZ = 'UTC';
};

export default globalSetup;
