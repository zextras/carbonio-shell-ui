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

/* eslint-disable @typescript-eslint/no-explicit-any */

import { map, forIn, filter, filter as loFilter } from 'lodash';
import { ComponentClass, FunctionComponent, ReactElement } from 'react';

import { IGetInfoRequest, IGetInfoResponse, ISoapResponseContent } from '../network/ISoap';
import { IFCSink } from '../fc/IFiberChannel';
import { IMainSubMenuItemData, IRouterService } from '../router/IRouterService';
import { ISharedLibrariesAppsMap } from './SharedLibraries';
import RevertableActionCollection from './RevertableActionCollection';
import { INetworkService } from '../network/INetworkService';
import { IAppPgkDescription } from '../network/IApi';
import { IIdbInternalService } from '../idb/IIdbInternalService';
import { IOfflineService } from '../offline/IOfflineService';
import { IFiberChannelService } from '../fc/IFiberChannelService';
import { ISessionService } from '../session/ISessionService';
import I18nService from '../i18n/I18nService';
import { BehaviorSubject, Observable } from 'rxjs';

import OfflineCtxt from '../offline/OfflineContext';
import ScreenSizeCtxt from '../screenSize/ScreenSizeContext';
import SyncCtxt from '../sync/SyncContext';
import I18nCtxt from '../i18n/I18nContext';

/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as MaterialUI from '@material-ui/core';
import * as MaterialUIStyles from '@material-ui/core/styles';
import * as MaterialUIIcons from '@material-ui/icons';
import * as IDB from 'idb';
import * as Lodash from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// @ts-ignore
import * as ReactVirtualized from 'react-virtualized';
import * as RxJS from 'rxjs';
import * as RxJSOperators from 'rxjs/operators';
import * as Clsx from 'clsx';
// @ts-ignore
import * as ReactRouter from 'react-router';
// @ts-ignore
import * as ReactRouterDom from 'react-router-dom';
import * as shellUtils from '../utils/ShellUtils';
import * as Moment from 'moment';
// @ts-ignore
import * as ZappUI from '@zextras/zapp-ui';
// @ts-ignore
import * as StyledComponents from 'styled-components';
import * as PropTypes from 'prop-types';
import { IServiceWorkerService } from '../serviceworker/IServiceWorkerService';
import { PromiseCollector } from './PromiseCollector';
import { ISyncOperation, ISyncOpRequest, ISyncService } from '../sync/ISyncService';
/* eslint-enable @typescript-eslint/ban-ts-ignore */

type IChildWindow = Window & {
	__ZAPP_SHARED_LIBRARIES__: ISharedLibrariesAppsMap;
	__ZAPP_EXPORT__: (value?: ZAppModuleFunction | PromiseLike<ZAppModuleFunction> | undefined) => void;
	__ZAPP_HMR_EXPORT__: (mod: ZAppModuleFunction) => void;
};

export default class ExtensionService {

	private _iframes: { [pkgName: string]: HTMLIFrameElement } = {};
	private _styles: { [pkgName: string]: HTMLLinkElement } = {};
	private _revertableActions: { [pkgName: string]: RevertableActionCollection } = {};
	private _fcSink: IFCSink;
	private _sessionId?: string;

	constructor(
		private _fcSrvc: IFiberChannelService,
		private _routerSrvc: IRouterService,
		private _networkSrvc: INetworkService,
		private _idbSrvc: IIdbInternalService,
		private _offlineSrvc: IOfflineService,
		private _sessionSrvc: ISessionService,
		private _syncSrvc: ISyncService,
		private _i18nSrvc: I18nService,
		private _serviceWorkerSrvc: IServiceWorkerService
	) {
		this._fcSink = this._fcSrvc.getInternalFCSink();
		_sessionSrvc.session.subscribe((session) => {
			if (session) {
				if (!this._sessionId) {
					this._sessionId = session.id;
					this.loadUserExtensions().then(() => undefined);
				} else if (this._sessionId !== session.id) {
					this._sessionId = session.id;
					this.unloadUserExtensions().then(() => this.loadUserExtensions().then(() => undefined));
				}
			} else {
				delete this._sessionId;
				this.unloadUserExtensions().then(() => undefined);
			}
		});
	}

	public async loadUserExtensions(): Promise<void> {
		const getInfoResp = await this._networkSrvc.sendSOAPRequest<IGetInfoRequest, IGetInfoResponse>(
			'GetInfo',
			{
				sections: 'zimlets'
			}
		);
		const promiseCollector = new PromiseCollector();
		try {
			await Promise.all(
				map(
					filter(
						getInfoResp.zimlets.zimlet,
						(z) => z.zimlet[0]['zapp'] === 'true' && typeof z.zimlet[0]['zapp-main'] !== 'undefined'
					),
					async (z) => this._loadExtension({
						package: z.zimlet[0].name,
						name: z.zimlet[0].label,
						description: z.zimlet[0].description,
						version: z.zimlet[0].version,
						resourceUrl: `/zx/zimlet/${ z.zimlet[0].name }`,
						entryPoint: z.zimlet[0]['zapp-main']!,
						styleEntryPoint: z.zimlet[0]['zapp-style']
					},
						promiseCollector
					)
				)
			);
			await promiseCollector.waitAll();
		} catch (e) {
			// lol
		} finally {
			this._fcSink('app:all-loaded');
		}
	}

	private _loadExtension: (
		pkg: IAppPgkDescription,
		pc: PromiseCollector
	) => Promise<void> = async (pkg, pc) => {
		try {
			this._fcSink<{ package: string }>('app:preload', { package: pkg.package });
			if (pkg.styleEntryPoint) this._loadStyle(pkg);
			const extModule = await this._loadExtensionModule(pkg, pc);
			extModule.call(undefined);
			try {
				this._fcSink<{ package: string; version: string }>('app:loaded', {
					package: pkg.package,
					version: pkg.version
				});
			} catch (err) {
				this._fcSink<{ package: string; version: string; error: Error }>('app:load-error', {
					package: pkg.package,
					version: pkg.version,
					error: err
				});
			}
		} catch (err) {
			this._fcSink<{ package: string; version: string; error: Error }>('app:load-error', {
				package: pkg.package,
				version: pkg.version,
				error: err
			});
		}
	};

	public async unloadUserExtensions(): Promise<void> {
		return new Promise((resolve) => {
			forIn(this._revertableActions, (revertableActions, key) => {
				this._fcSink<{ package: string }>('app:preunload', { package: key });
				revertableActions.revert();
				this._fcSink<{ package: string }>('app:unloaded', { package: key });
			});
			this._revertableActions = {};
			forIn(this._styles, (value, key) => {
				document.head.removeChild(value);
			});
			this._styles = {};
			forIn(this._iframes, (value, key) => {
				document.body.removeChild(value);
			});
			this._iframes = {};
			resolve();
		});
	}

	private _loadExtensionModule(
		appPkg: IAppPgkDescription,
		pc: PromiseCollector
	): Promise<ZAppModuleFunction> {
		return new Promise((resolve, reject) => {
			const path = `${ appPkg.resourceUrl }/${ appPkg.entryPoint }`;
			const iframe: HTMLIFrameElement = document.createElement('iframe');
			iframe.style.display = 'none';
			// iframe.setAttribute('src', path);
			document.body.appendChild(iframe);
			if (iframe.contentWindow && iframe.contentDocument) {
				const script: HTMLScriptElement = iframe.contentDocument.createElement('script');
				const revertables = this._revertableActions[appPkg.package] = new RevertableActionCollection(
					this._routerSrvc,
					this._networkSrvc
				);
				const syncOperations: BehaviorSubject<Array<ISyncOperation<unknown, ISyncOpRequest<unknown>>>> = new BehaviorSubject(
					map(
						loFilter(
							this._syncSrvc.syncOperations.getValue(),
							(op) => op.app.package === appPkg.package
						),
						(op) => op.operation
					)
				);
				this._syncSrvc.syncOperations
					.subscribe((ops) => {
						syncOperations.next(
							map(
								loFilter(
									ops,
									(op) => op.app.package === appPkg.package
								),
								(op) => op.operation
							)
						);
					});
				(iframe.contentWindow as IChildWindow).__ZAPP_SHARED_LIBRARIES__ = {
					'clsx': Clsx,
					'react': React,
					'react-dom': ReactDOM,
					'react-virtualized': ReactVirtualized,
					'@material-ui/core': MaterialUI,
					'@material-ui/core/styles': MaterialUIStyles,
					'@material-ui/icons': MaterialUIIcons,
					'idb': IDB,
					'lodash': Lodash,
					'rxjs': RxJS,
					'rxjs/operators': RxJSOperators,
					'react-router': ReactRouter,
					'react-router-dom': ReactRouterDom,
					'styled-components': StyledComponents,
					'prop-types': PropTypes,
					'moment': Moment,
					'@zextras/zapp-shell/context': {
						OfflineCtxt: OfflineCtxt,
						ScreenSizeCtxt: ScreenSizeCtxt,
						SyncCtxt: SyncCtxt,
						I18nCtxt: I18nCtxt
					},
					'@zextras/zapp-shell/fc': {
						fc: this._fcSrvc.getFiberChannelForExtension(appPkg.package),
						fcSink: this._fcSrvc.getFiberChannelSinkForExtension(appPkg.package, appPkg.version)
					},
					'@zextras/zapp-shell/idb': this._idbSrvc.createIdbService(appPkg.package),
					'@zextras/zapp-shell/network': {
						sendSOAPRequest: <REQ, RESP extends ISoapResponseContent>(command: string, data: REQ, urn?: 'urn:zimbraAccount' | 'urn:zimbraMail' | string): Promise<RESP> => this._networkSrvc.sendSOAPRequest<REQ, RESP>(command, data, urn)
					},
					'@zextras/zapp-shell/router': {
						addMainMenuItem: (icon: ReactElement, label: string, to: string, children?: Observable<Array<IMainSubMenuItemData>>): void => revertables.addMainMenuItem(icon, label, to, appPkg.package, children),
						registerRoute: <T>(path: string, component: ComponentClass<T> | FunctionComponent<T>, defProps: T): void => revertables.registerRoute<T>(path, component, defProps, appPkg.package),
						addCreateMenuItem: (icon: ReactElement, label: string, to: string): void => revertables.addCreateMenuItem(icon, label, to, appPkg.package)
					},
					'@zextras/zapp-shell/service': {
						offlineSrvc: this._offlineSrvc,
						sessionSrvc: this._sessionSrvc,
						serviceWorkerSrvc: {
							registerAppServiceWorker: (path: string): Promise<ServiceWorkerRegistration> => {
								return pc.addPromise<ServiceWorkerRegistration>(
									this._serviceWorkerSrvc.registerServiceWorker(`${appPkg.resourceUrl}/${path}`, `${appPkg.resourceUrl}/`)
								);
							}
						}
					},
					'@zextras/zapp-shell/sync': {
						syncOperations
					},
					'@zextras/zapp-shell/utils': {
						...shellUtils,
						registerLanguage: (bundle: any, lang: string): void => this._i18nSrvc.registerLanguage(bundle, lang, appPkg.package)
					},
					'@zextras/zapp-ui': ZappUI
				};
				(iframe.contentWindow as IChildWindow).__ZAPP_EXPORT__ = resolve;
				(iframe.contentWindow as IChildWindow).__ZAPP_HMR_EXPORT__ = (extModule: ZAppModuleFunction): void => {
					console.log(`HMR ${ path }`, extModule);
					revertables.revert();
					extModule.call(undefined);
				};
				script.type = 'text/javascript';
				script.setAttribute('src', path);
				script.addEventListener('error', reject);
				iframe.contentDocument.body.appendChild(script);
				this._iframes[appPkg.package] = iframe;
			} else
				reject(new Error('Cannot create extension loader'));
		});
	}

	private _loadStyle(appPkg: IAppPgkDescription): void {
		const link: HTMLLinkElement = document.createElement('link');
		link.setAttribute('href', `${ appPkg.resourceUrl }/${ appPkg.styleEntryPoint }`);
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('type', 'text/css');
		this._styles[appPkg.package] = link;
		document.head.appendChild(link);
	}

}

type ZAppModuleFunction = () => void;
