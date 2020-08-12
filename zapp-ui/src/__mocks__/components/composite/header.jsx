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

export default function Header({ quota,onMenuClick,onUserClick,navigationBarIsOpen,userBarIsOpen }) {
	return `Header ( quota=${quota}, onMenuClick=${onMenuClick?'set':'unset'}, onUserClick=${onUserClick?'set':'unset'}, navigationBarIsOpen=${navigationBarIsOpen?'set':'unset'}, userBarIsOpen=${userBarIsOpen?'set':'unset'})`;
}