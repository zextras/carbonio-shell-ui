/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormSubSection, Button } from '@zextras/zapp-ui';
import { useHistory } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useDispatch } from '../store/shell-store-hooks';
import { doLogout } from '../store/accounts-slice';
import { goToLogin } from '../account/go-to-login';

const Logout: FC = () => {
	const [t] = useTranslation();
	// const history = useHistory();

	// const dispatch = useDispatch();

	const onClick = useCallback(() => {
		goToLogin();
		// dispatch(doLogout()).then(() => history.push({ pathname: '/' }));
	}, []);
	return (
		<FormSubSection
			label={t('settings.general.account', 'Account')}
			minWidth="calc(min(100%, 512px))"
			width="50%"
		>
			<Button label={t('settings.general.account_logout', 'Logout')} onClick={onClick} />
		</FormSubSection>
	);
};

export default Logout;
