/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createContext, useContext } from 'react';

export const BootstrapperContext = createContext<any>({});

export function useI18nFactory(): any {
	const { i18nFactory } = useContext(BootstrapperContext);
	return i18nFactory;
}

export function useStoreFactory(): any {
	const { storeFactory } = useContext(BootstrapperContext);
	return storeFactory;
}
