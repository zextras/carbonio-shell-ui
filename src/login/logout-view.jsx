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

import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useShellDb, useShellNetworkService } from '../bootstrap/bootstrapper-context';

export default function LogoutView() {
	const history = useHistory();
	const db = useShellDb();
	const network = useShellNetworkService();

	const doLogout = useCallback((ev) => {
		ev.preventDefault();
		db.accounts.clear()
			.then(() => {
				history.push({
					pathname: '/'
				});
			});
	}, [db, network, history]);

	return (
		<form onSubmit={doLogout}>
			You are going to be logged-out.
			<button type="submit">Log me out</button>
		</form>
	);
}
