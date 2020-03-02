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

import { createContext } from 'react';
import { ItemAction, ItemActionContext } from './IItemActionContext';

export default createContext<ItemActionContext>({
	actions: {},
	addAction(ctxt: string, a: ItemAction): void {},
	removeAction(ctxt: string, name: string): void {}
});
