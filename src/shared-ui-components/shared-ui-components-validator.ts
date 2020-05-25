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

import { ComponentClass } from 'react';

export default function validateSharedUiComponent(c: ComponentClass): boolean {
	if (!c.propTypes) {
		throw new Error('Shared UI Components MUST declare \'propTypes\'.');
	}
	return true;
}
