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

import { Subject } from 'rxjs';

import { extendTheme } from '@zextras/zapp-ui';
import { SharedLibrariesThemesMap } from '../extension/SharedLibraries';
import { forIn } from 'lodash';
import { IAppPgkDescription } from '../network/IApi';
import { ISessionService } from '../session/ISessionService';
import { Theme } from './ITheme';
import { IShellNetworkService } from '../network/IShellNetworkService';

type IChildWindow = Window & {
	__ZAPP_SHARED_LIBRARIES__: SharedLibrariesThemesMap;
	__ZAPP_EXPORT__: (value?: ZThemeModuleFunction | PromiseLike<ZThemeModuleFunction> | undefined) => void;
	__ZAPP_HMR_EXPORT__: (mod: ZThemeModuleFunction) => void;
}

export default class ThemeService {

	public theme: Subject<Theme> = new Subject<Theme>();

	private _iframes: { [pkgName: string]: HTMLIFrameElement } = {};
	private _sessionId?: string;

	constructor(
		private _networkSrvc: IShellNetworkService,
		private _sessionSrvc: ISessionService
	) {
		_sessionSrvc.session.subscribe((session) => {
			if (session) {
				if (!this._sessionId) {
					this._sessionId = session.id;
					this.loadTheme().then(() => undefined);
				} else if (this._sessionId !== session.id) {
					this._sessionId = session.id;
					this.unloadTheme().then(() => this.loadTheme().then(() => undefined));
				}
			} else {
				delete this._sessionId;
				this.unloadTheme().then(() => undefined);
			}
		});
	}

	public loadTheme(): Promise<void> {
		return this._networkSrvc.getThemes()
			.then((themeModifiers) => {
				if (themeModifiers.length > 0) {
					return this._loadThemeModule(themeModifiers[0])
						.then((modifier) => {
							this.theme.next(
								extendTheme(modifier(extendTheme({})))
							);
						});
				}
			});
	}

	public async unloadTheme(): Promise<void> {
		return new Promise((resolve) => {
			forIn(this._iframes, function(value) {
				document.body.removeChild(value);
			});
			this._iframes = {};
			this.theme.next(
				extendTheme({})
			);
			resolve();
		});
	}

	private _loadThemeModule(themePkg: IAppPgkDescription): Promise<ZThemeModuleFunction> {
		return new Promise((resolve, reject) => {
			const path = `${ themePkg.resourceUrl }/${ themePkg.entryPoint }`;
			const iframe: HTMLIFrameElement = document.createElement('iframe');
			iframe.style.display = 'none';
			// iframe.setAttribute('src', path);
			document.body.appendChild(iframe);
			if (iframe.contentWindow && iframe.contentDocument) {
				const script: HTMLScriptElement = iframe.contentDocument.createElement('script');
				(iframe.contentWindow as IChildWindow).__ZAPP_SHARED_LIBRARIES__ = {};
				(iframe.contentWindow as IChildWindow).__ZAPP_EXPORT__ = resolve;
				(iframe.contentWindow as IChildWindow).__ZAPP_HMR_EXPORT__ = (mod: ZThemeModuleFunction): void => {
					console.log(`HMR ${ path }`, mod);
					this.theme.next(
						extendTheme(mod(extendTheme({})))
					);
				};
				script.type = 'text/javascript';
				script.setAttribute('src', path);
				// script.text = `
				// 	fetch('${path}').then(function(extReq) {
				// 		extReq.text().then(function(extCode) {
				// 			__ZAPP_EXPORT__(
				// 				eval(extCode)
				// 			);
				// 		});
				// 	});
				// `;
				iframe.contentDocument.body.appendChild(script);
				this._iframes[themePkg.package] = iframe;
			} else
				reject(new Error('Cannot create extension loader'));
		});
	}

}

type ZThemeModuleFunction = (theme: Theme) => Theme;
