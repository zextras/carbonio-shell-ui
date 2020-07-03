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
import useLoginView from './login-view-hook';
import { useTranslation } from '../i18n/hooks';

export default function LoginView() {
	const {
		doLogin,
		usernameRef,
		passwordRef,
		returnToPage
	} = useLoginView();
	const { t } = useTranslation();

	return (
		<div>
			<form onSubmit={doLogin}>
				<label htmlFor="username">{ t('Username') }</label>
				<input ref={usernameRef} id="username" name="username" />
				<label htmlFor="password">{ t('Password') }</label>
				<input ref={passwordRef} id="password" name="password" type="password" />
				<button type="submit">
					{ t('Login') }
				</button>
				<button onClick={returnToPage}>
					{ t('Cancel') }
				</button>
			</form>
		</div>
	);
}
