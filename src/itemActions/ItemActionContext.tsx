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

import React, { useState, createContext, Context, ReactElement, PropsWithChildren, useEffect } from 'react';
import { IItemActionContext, ItemActionContextProviderProps } from './IItemAction';

export const ItemActionContext: Context<IItemActionContext>  = createContext<IItemActionContext>({
	actions: {}
});
export const ItemActionContextProvider: (props: PropsWithChildren<ItemActionContextProviderProps>) => ReactElement = ({ itemActionSrvc, children }) => {
	const [ actions, setActions ] = useState({});

	useEffect(
		() => {
			const sub = itemActionSrvc.actions.subscribe(setActions);
			return () => sub.unsubscribe();
		},
		[itemActionSrvc]
	);

	return (
		<ItemActionContext.Provider value={{ actions }}>
			{children}
		</ItemActionContext.Provider>
	);
};
