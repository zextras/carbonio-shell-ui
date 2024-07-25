/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { TFunction } from 'i18next';

import { SEARCH_APP_ID } from '../../constants';
import { SearchAppView } from '../../search/search-app-view';
import { useAppStore } from '../../store/app';
import type { AppRouteDescriptor } from '../../types/apps';

const searchRouteDescriptor = (t: TFunction): AppRouteDescriptor => ({
	id: SEARCH_APP_ID,
	app: SEARCH_APP_ID,
	route: SEARCH_APP_ID,
	appView: SearchAppView,
	badge: {
		show: false
	},
	label: t('search.app', 'Search'),
	position: 1000,
	visible: true,
	primaryBar: 'SearchModOutline'
});

export const registerDefaultViews = (t: TFunction): void => {
	useAppStore.getState().addRoute(searchRouteDescriptor(t));
};
