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
import { SEARCH_APP_ID } from '../constants/index';
import { ZextrasModule } from '../../types';

export const getSearchCore = (t: TFunction): ZextrasModule => ({
	priority: 2,
	name: SEARCH_APP_ID,
	display: t('search.app', 'Search'),
	version: '0.0.0',
	js_entrypoint: '',
	commit: '',
	route: SEARCH_APP_ID
});

export const searchAppData = {
	icon: 'SearchModOutline',
	views: {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		app: SearchAppView
	}
};
