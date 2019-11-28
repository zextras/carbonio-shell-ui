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

import { createContext, Context } from 'react';

import { IRouterContext } from './IRouterContext';
import { BehaviorSubject } from 'rxjs';
import { ICreateMenuItemData, IMainMenuItemData, IRouteData } from './IRouterService';

const context: Context<IRouterContext> = createContext<IRouterContext>({
	mainMenuItems: new BehaviorSubject<IMainMenuItemData[]>([]),
	routes: new BehaviorSubject<IRouteData>({}),
	createMenuItems: new BehaviorSubject<Array<ICreateMenuItemData>>([]),
	currentRoute: new BehaviorSubject<string>('')
});
export default context;
