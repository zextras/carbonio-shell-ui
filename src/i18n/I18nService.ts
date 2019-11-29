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

import i18n from './i18n';
import { i18n as Ii18n } from 'i18next';
import { II18nContext } from './II18nContext';
import { II18nService } from './II18nService';

export default class I18nService implements II18nService{

	private i18n: Ii18n;

	constructor() {
		this.i18n = i18n;
	}

	public registerLanguage(bundle: any, lang: string, pkgName: string): void {
		this.i18n.addResourceBundle(lang, pkgName, bundle, true, true);
	}

	public createI18nContext(namespace: string): II18nContext {
		return {
			t: this.i18n.getFixedT(null, [namespace, 'com_zextras_zapp_shell', 'src']),
		};
	}
}
