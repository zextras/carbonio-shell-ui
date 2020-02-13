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
/* eslint-env serviceworker */

const _ = self.__ZAPP_SHARED_LIBRARIES__['lodash'];

self._loadExtensions = function(appsList) {
	console.log('appsList', appsList);
	return 'Loading extensions...';
};

self._unloadExtensions = function() {
	return 'Unloading extensions...';
};
