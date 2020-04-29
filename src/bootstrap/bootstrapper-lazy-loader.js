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

import { lazy } from 'react';

export const LazyLoginView = lazy(() => (import(/* webpackChunkName: "login-view" */ '../login/login-view')));
export const LazyLogoutView = lazy(() => (import(/* webpackChunkName: "logout-view" */ '../login/logout-view')));
export const LazyShellView = lazy(() => (import(/* webpackChunkName: "shell-view" */ '../shell/shell-view')));
