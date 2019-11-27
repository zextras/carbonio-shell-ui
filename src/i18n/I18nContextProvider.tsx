/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2019 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { FC } from 'react';

import { II18nService } from './II18nService';
import I18nContext from './I18nContext';

interface II18nContextProvider {
	i18nService: II18nService;
	namespace: string;
}

const I18nContextProvider: FC<II18nContextProvider> = ({ i18nService, namespace, children }) => {
	return (
		<I18nContext.Provider value={
			i18nService.createI18nContext(namespace)
		}>
			{children}
		</I18nContext.Provider>
	);
};
export default I18nContextProvider;
