/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2019 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Container, Input, PasswordInput, ThemeContext, Logo, Button, Padding, Text } from '@zextras/zapp-ui';
import styled, { createGlobalStyle } from 'styled-components';
import SessionContext from '../session/SessionContext';
import I18nContext from '../i18n/I18nContext';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

const BG = styled.div`
	background-image: url(${props => props.theme.loginBackground});
	background-size: cover;
	height: 100%;
	width: 100%;
`;

const LoginPage = () => {
	const theme = useContext(ThemeContext);
	const [ btnDisabled, setBtnDisabled ] = useState(false);
	const { t } = useContext(I18nContext);
	const sessionCtx = useContext(SessionContext);
	const usernameRef = React.createRef();
	const passwordRef = React.createRef();

	const doLogin = useCallback(
		() => {
			if (!usernameRef.current || !passwordRef.current) return;
			const username = usernameRef.current.value;
			const password = passwordRef.current.value;
			setBtnDisabled(true);
			sessionCtx.doLogin(
				username,
				password
			).catch(() => setBtnDisabled(false));
		}, [usernameRef, passwordRef, setBtnDisabled, sessionCtx]);

	const onPress = useCallback(
		(event) => {
			if ('Enter' === event.key) {
				doLogin();
			}
		},
		[doLogin]
	);

	useEffect(() => {
		window.addEventListener('keypress', onPress);
		return () => {
			window.removeEventListener('keypress', onPress);
		}
	}, [onPress]);

	return (
		<BG>
			<GlobalStyle/>
			<Container
				height="fill"
				width="50%"
				style={{
					backgroundColor: 'rgba(255, 255, 255, 0.5)'
				}}
			>
				<Container
					width="50%"
					height="fill"
					orientation="vertical"
					mainAlignment="space-around"
				>
						<Logo size="large"/>
					<Container
						width="fill"
						height="fit"
						orientation="vertical"
						mainAlignment="center"
					>
						<Padding all='medium'>
							<Input
								label="Username"
								inputRef={usernameRef}
							/>
						</Padding>
						<Padding all='medium'>
							<PasswordInput
								label="Password"
								inputRef={passwordRef}
							/>
						</Padding>
						<Padding all="medium">
							<Button
								label="LOGIN"
								backgroundColor="primary"
								size="fill"
								labelColor="light"
								onClick={doLogin}
							/>
						</Padding>
					</Container>
					<Container height="fit">
						<Text color="secondary" size="small">
							{t('login.copyright', { year: new Date().getFullYear() })}
						</Text>
					</Container>
				</Container>
			</Container>
		</BG>
	);
};
export default LoginPage;
