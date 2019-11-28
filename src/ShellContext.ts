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

// import fetch from 'whatwg-fetch';

export class ShellContext {

	private _splash: HTMLElement;

	constructor(splash: HTMLElement) {
		this._splash = splash;
	}

	async renderShell(): Promise<void> {
		const { loadShell } = await import(/*  webpackChunkName: "Shell" */ './Shell');
		const container = document.createElement('div');
		container.id = 'app';
		container.setAttribute('style', 'height: 100%');
		document.body.appendChild(container);
		loadShell(container);
		document.body.removeChild(this._splash);
	}

}
