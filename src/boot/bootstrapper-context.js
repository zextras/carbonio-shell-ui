/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createContext, useContext } from 'react';

export const BootstrapperContext = createContext({});

export function useI18nFactory() {
	const { i18nFactory } = useContext(BootstrapperContext);
	return i18nFactory;
}

export function useStoreFactory() {
	const { storeFactory } = useContext(BootstrapperContext);
	return storeFactory;
}
