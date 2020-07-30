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

export type AccountLoginData = {
	/** Zimbra auth token */ t: string;
	/** Username */ u: string;
	/** Password */ p: string;
};

type BasePkgDescription = {
	priority: number;
	package: string;
	name: string;
	description: string;
	version: string;
	resourceUrl: string;
	entryPoint: string;
};

export type AppPkgDescription = BasePkgDescription & {
	swExtension?: string;
	styleEntryPoint?: string;
};

export type ThemePkgDescription = BasePkgDescription & {};

export type AccountAppsData = Array<AppPkgDescription>;
export type AccountThemesData = Array<ThemePkgDescription>;

export interface IAccount {
	id: string;
	name: string;
	login: AccountLoginData;
	apps: AccountAppsData;
	themes: AccountThemesData;
}

export default class Account implements IAccount {
	protected _id?: string;

	constructor(
		public id: string,
		public name: string,
		public login: AccountLoginData,
		public apps: AccountAppsData,
		public themes: AccountThemesData
	) { }
}
