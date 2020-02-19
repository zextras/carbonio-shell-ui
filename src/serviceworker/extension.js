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
/* eslint-disable @typescript-eslint/camelcase */

const { forEach } = self.__ZAPP_SHARED_LIBRARIES__['lodash'];

self.__ZAPP_SHARED_LIBRARIES_SHIMS__ = {};
self._ZAPP_SERVICEWORKER_EXTENSIONS_ = {};

function _generateAppShimFC(pkgName, version) {
	return {
		fc: self._zapp_fcSrvc.getFiberChannelForExtension(pkgName),
		fcSink: self._zapp_fcSrvc.getFiberChannelSinkForExtension(pkgName, version)
	};
}

function _generateAppShimIdb(pkgName, version) {
	return self._zapp_idbSrvc.createIdbService(pkgName);
}

function _generateAppShims(appPkg) {
	self.__ZAPP_SHARED_LIBRARIES_SHIMS__[appPkg['package']] = {
		'@zextras/zapp-shell/fc': _generateAppShimFC(appPkg['package'], appPkg.version),
		'@zextras/zapp-shell/idb': _generateAppShimIdb(appPkg['package'], appPkg.version)
	};
}

self._zapp_loadExtensions = function(appsList) {
	console.log('AppList', appsList);
	const extensionsUrls = [];
	forEach(
		appsList,
		(appPkg) => {
			extensionsUrls.push(`${ appPkg.resourceUrl }/${ appPkg.serviceworkerExtension }`);
			_generateAppShims(appPkg);
		}
	);
	importScripts(extensionsUrls);
	forEach(
		appsList,
		(appPkg) => {
			console.log('Serviceworker extension loaded', appPkg['package']);
		}
	);
};

self._zapp_unloadExtensions = function() {
	return 'Unloading extensions...';
};
