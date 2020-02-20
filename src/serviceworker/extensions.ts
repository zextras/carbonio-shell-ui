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

import { forEach } from 'lodash';
import { IFiberChannelService } from '../fc/IFiberChannelService';
import { IIdbInternalService } from '../idb/IIdbInternalService';
import { AppPackageDescription } from '../extension/IExtensionService';

function _generateAppShimFC(pkgName: string, version: string, fcSrvc: IFiberChannelService) {
	return {
		fc: fcSrvc.getFiberChannelForExtension(pkgName),
		fcSink: fcSrvc.getFiberChannelSinkForExtension(pkgName, version)
	};
}

function _generateAppShimIdb(pkgName: string, version: string, idbSrvc: IIdbInternalService) {
	return idbSrvc.createIdbService(pkgName);
}

function _generateAppShims(
	appPkg: AppPackageDescription,
	fcSrvc: IFiberChannelService,
	idbSrvc: IIdbInternalService
) {
	self.__ZAPP_SHARED_LIBRARIES_SHIMS__[appPkg['package']] = {
		'@zextras/zapp-shell/fc': _generateAppShimFC(appPkg['package'], appPkg.version, fcSrvc),
		'@zextras/zapp-shell/idb': _generateAppShimIdb(appPkg['package'], appPkg.version, idbSrvc)
	};
}

export function loadExtensions(
	appsList: AppPackageDescription[],
	fcSrvc: IFiberChannelService,
	idbSrvc: IIdbInternalService
) {
	return new Promise((resolve, reject) => {
		const extensionsUrls: string[] = [];
		forEach(
			appsList,
			(appPkg) => {
				extensionsUrls.push(`${ appPkg.resourceUrl }/${ appPkg.serviceworkerExtension }`);
				_generateAppShims(appPkg, fcSrvc, idbSrvc);
			}
		);
		importScripts(...extensionsUrls);
		forEach(
			appsList,
			(appPkg) => {
				console.log('Serviceworker extension loaded', appPkg['package']);
			}
		);
		resolve();
	});
}

export function unloadExtensions() {
	return 'Unloading extensions...';
}
