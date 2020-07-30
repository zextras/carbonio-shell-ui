/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
/* eslint-disable */
import app from './app';

window.__ZAPP_EXPORT__(app);

if (module.hot) {
	module.hot.accept('./app.jsx', () => {
		window.__ZAPP_HMR_EXPORT__(app);
	});
}
