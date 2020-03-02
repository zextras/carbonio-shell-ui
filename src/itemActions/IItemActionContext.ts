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

import { ReactElement } from 'react';

export type AppItemAction = {
	/** The name of the action, must be unique inside an App */ name: string;
	/** The icon of the action */ icon: ReactElement;
	/** The icon of the action */ label: string;
	/** The callback invoked on an item */ onActivate: (item: any) => void;
	/** @optional Function to check if the action can be applied to the item(s) */ onCheck?: (item: any) => Promise<boolean>;
};

export type ItemAction = AppItemAction & {
	package: string;
	version: string;
	onCheck: (item: any) => Promise<boolean>;
};

export type WrappedItemAction = {
	icon: ReactElement;
	label: string;
	onActivate: () => void;
	onCheck: () => Promise<boolean>;
};

export type ItemActionContext = {
	actions: {[ctxt: string]: ItemAction[]};
	addAction(ctxt: string, a: ItemAction): void;
	removeAction(ctxt: string, name: string): void;
};
