/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import { Database } from '../db/database';
import { AppPkgDescription } from '../../types';

export function wrapAppDbConstructor(pkg: AppPkgDescription): any {
	abstract class AppDb extends Database {
		protected constructor(dbName: string, options?: any) {
			super(`${pkg.package}$${dbName}`, options);
		}
	}

	return AppDb;
}
