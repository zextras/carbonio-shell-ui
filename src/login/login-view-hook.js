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
import {
	useCallback, useEffect, useRef, useState
} from 'react';
import { useShellNetworkService } from '../bootstrap/bootstrapper-context';

export default function useLoginView() {
	const history = useHistory();
	const location = useLocation();
	const network = useShellNetworkService();

	const [from, setFrom] = useState();
	useEffect(() => {
		setFrom(location.state || { from: { pathname: '/' } });
	}, [location, setFrom]);

	const usernameRef = useRef();
	const passwordRef = useRef();

	const returnToPage = useCallback(() => {
		history.replace(from);
	}, [history, from]);

	const doLogin = useCallback((ev) => {
		ev.preventDefault();
		return new Promise(((resolve, reject) => {
			network.doLogin(
				usernameRef.current.value,
				passwordRef.current.value
			)
				.then(() => resolve())
				.then(() => returnToPage())
				.catch((err) => reject(err));
		}));
	}, [returnToPage, usernameRef, passwordRef, network]);

	return {
		doLogin,
		usernameRef,
		passwordRef,
		returnToPage
	};
}
