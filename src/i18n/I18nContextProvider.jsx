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

import React, { useMemo } from 'react';
import I18nContext from './I18nContext';

const I18nContextProvider = ({ i18nService, namespace, children }) => {
	const context = useMemo(() => i18nService.createI18nContext(namespace), [namespace, i18nService]);
	return (
		<I18nContext.Provider
			value={
				context
			}
		>
			{ children }
		</I18nContext.Provider>
	);
};
export default I18nContextProvider;
