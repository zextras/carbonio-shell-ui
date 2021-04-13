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

import { useHistory, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from '../store/shell-store-hooks';
import { doLogin } from '../store/accounts-slice';

export default function useLoginView() {
	const history = useHistory();
	const location = useLocation();
	const dispatch = useDispatch();

	const [from, setFrom] = useState();
	useEffect(() => {
		setFrom(location.state || { from: { pathname: '/' } });
	}, [location, setFrom]);

	const usernameRef = useRef();
	const passwordRef = useRef();

	const returnToPage = useCallback(() => {
		history.replace(from);
	}, [history, from]);

	const doLoginCbk = useCallback(
		(ev) => {
			ev.preventDefault();
			return dispatch(
				doLogin({
					username: usernameRef.current.value,
					password: passwordRef.current.value
				})
			).then(() => returnToPage());
		},
		[dispatch, returnToPage]
	);

	return {
		doLogin: doLoginCbk,
		usernameRef,
		passwordRef,
		returnToPage
	};
}
