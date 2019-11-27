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

import { i18n as Ii18n } from 'i18next';
import { II18nContext } from './II18nContext';

export interface II18nService {
	registerLanguage: (bundle: any, lang: string, pkgName: string) => void;
	createI18nContext: (namespace: string) => II18nContext;
}