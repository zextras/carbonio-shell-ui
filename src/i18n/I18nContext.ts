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

import { createContext, Context } from 'react';

import { II18nContext } from './II18nContext';
import { TFunction } from 'i18next';

const context: Context<II18nContext> = createContext<II18nContext>({
	t: undefined as unknown as TFunction
});
export default context;
