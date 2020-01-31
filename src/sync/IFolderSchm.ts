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

export type IFolderSchm = {};

export type IFolderSchmV1 = IFolderSchm & {
	_revision: number;
	id: string;
	parent: string;
	path: string;
	name: string;
	unreadCount: number;
	itemsCount: number;
	size: number;
};
