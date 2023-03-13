/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export type LoginConfigStore = {
	carbonioWebUiDarkMode?: boolean;
	carbonioWebUiAppLogo?: string;
	carbonioWebUiDarkAppLogo?: string;
	carbonioWebUiTitle: string;
	carbonioWebUiFavicon: string;
	carbonioWebUiPrimaryColor?: string;
	carbonioWebUiDarkPrimaryColor?: string;
	loaded: boolean;
};
