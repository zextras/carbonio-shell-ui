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

import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from '../store/shell-store-hooks';
import { doLogout } from '../store/accounts-slice';

export default function LogoutView() {
	const history = useHistory();
	const dispatch = useDispatch();
	const [ t ] = useTranslation();

	const doLogoutCbk = useCallback((ev) => {
		ev.preventDefault();
		dispatch(
			doLogout()
		)
			.then(() => history.push({ pathname: '/' }));
	}, []);

	return (
		<form onSubmit={doLogoutCbk}>
			{ t('You are going to be logged-out') }
			<button type="submit">{ t('Log me out') }</button>
		</form>
	);
}
