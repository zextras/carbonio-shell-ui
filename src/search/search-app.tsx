/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import { TFunction } from 'react-i18next';
import { SearchAppView } from './search-app-view';
import { CoreAppData } from '../store/app/store-types';
import { SEARCH_APP_ID } from '../constants/index';

export const getSearchCore = (t: TFunction): CoreAppData => ({
	priority: -1,
	package: SEARCH_APP_ID,
	name: t('search.app', 'Search'),
	description: t('search.app_description', 'Search Module'),
	version: '0.0.0',
	resourceUrl: '',
	entryPoint: ''
});

export const searchAppData = {
	icon: 'SearchModOutline',
	views: {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		app: SearchAppView
	}
};
