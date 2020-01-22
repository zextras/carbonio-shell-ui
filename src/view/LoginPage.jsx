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
import { Container, Input, PasswordInput, useScreenMode, Logo, Button, Padding, Text } from '@zextras/zapp-ui';
import styled, { createGlobalStyle } from 'styled-components';
import SessionContext from '../session/SessionContext';
import I18nContext from '../i18n/I18nContext';

const BG = styled.div`
	background-image: url(${props => props.theme.loginBackground});
	background-size: cover;
	height: 100%;
	width: 100%;
`;

const LoginPage = () => {
	const screenMode = useScreenMode();
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
			<Container
				height="fill"
				mainAlignment="space-between"
				width={screenMode === 'desktop' ? '50%' : '100%'}
				style={{
					backgroundColor: 'rgba(255, 255, 255, 0.5)'
				}}
			>
				<Container
					width="50%"
					height="70%"
					orientation="vertical"
					mainAlignment="space-around"
				>
					<Logo size="large"/>
					<Container
						width="fill"
						height="fit"
						orientation="vertical"
						mainAlignment="center"
						padding={{ all: 'medium' }}
					>
						<Container padding={{ vertical: 'medium' }}>
							<Input
								label="Username"
								inputRef={usernameRef}
							/>
						</Container>
						<Container padding={{ vertical: 'medium' }}>
							<PasswordInput
								label="Password"
								inputRef={passwordRef}
							/>
						</Container>
						<Container padding={{ vertical: 'medium' }}>
							<Button
								label="LOGIN"
								backgroundColor="bg_1"
								size="fill"
								labelColor="txt_3"
								onClick={doLogin}
							/>
						</Container>
					</Container>
				</Container>
				<Container height="fit" padding={{ all: 'large' }}>
					<Text color="txt_1" size="small">
						{t('login.copyright', { year: new Date().getFullYear() })}
					</Text>
				</Container>
			</Container>
		</BG>
	);
};
export default LoginPage;
