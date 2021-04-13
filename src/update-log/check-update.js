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

import moment from 'moment';

export function checkUpdate() {
	const today = moment();
	const nextNotifyOn = Number(localStorage.getItem('nextNotifyOn'));
	const differenceInDays = moment(nextNotifyOn).diff(today, 'days');
	if (differenceInDays <= 0) {
		return true;
	}
	return false;
}
