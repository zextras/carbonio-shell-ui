import { SHELL_MODES } from '../constants';

/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export const isClient = (): boolean =>
	__SHELL_ENV__ === SHELL_MODES.CARBONIO || __SHELL_ENV__ === SHELL_MODES.STANDALONE;
export const isAdmin = (): boolean => __SHELL_ENV__ === SHELL_MODES.ADMIN;
export const isStandalone = (): boolean => __SHELL_ENV__ === SHELL_MODES.STANDALONE;
export const isFullClient = (): boolean => __SHELL_ENV__ === SHELL_MODES.CARBONIO;
