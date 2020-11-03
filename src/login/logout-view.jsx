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
import { useShellNetworkService } from '../bootstrap/bootstrapper-context';
import { useTranslation } from '../i18n/hooks';

export default function LogoutView() {
	const history = useHistory();
	const network = useShellNetworkService();
	const { t } = useTranslation();

	const doLogout = useCallback((ev) => {
		ev.preventDefault();
		network.doLogout().then(() => {
			history.push({
				pathname: '/'
			});
		});
	}, [network, history]);

	return (
		<form onSubmit={doLogout}>
			{ t('You are going to be logged-out') }
			<button type="submit">{ t('Log me out') }</button>
		</form>
	);
}
