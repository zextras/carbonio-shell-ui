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

import { AppPkgDescription } from '../db/account';
import { Database } from '../db/database';

export function wrapAppDbConstructor(pkg: AppPkgDescription): any {
	abstract class AppDb extends Database {
		protected constructor(dbName: string, options?: any) {
			super(`${pkg.package}$${dbName}`, options);
		}
	}

	return AppDb;
}
