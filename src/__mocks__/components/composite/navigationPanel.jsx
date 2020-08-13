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

import React from 'react';

export default function NavigationPanel({ menuTree,navigationBarIsOpen,onCollapserClick,tree }) {
	return `NavigationPanel ( menuTree=${menuTree? 'set':'unset'}, navigationBarIsOpen=${navigationBarIsOpen? 'set':'unset'}, onCollapserClick=${onCollapserClick? 'set':'unset'},tree=${tree? 'set':'unset'})`;
}