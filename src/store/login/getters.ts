/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useLoginConfigStore } from './store';

export function getFavicon(): string {
	return useLoginConfigStore.getState().carbonioWebUiFavicon;
}

export function getClientTitle(): string {
	return useLoginConfigStore.getState().carbonioWebUiTitle;
}
