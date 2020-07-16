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

import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import {
	Button,
	Checkbox,
	Container,
	extendTheme,
	Input,
	Logo,
	Modal,
	Row,
	Padding,
	PasswordInput,
	SnackbarManager,
	Text,
	Tooltip,
	ThemeProvider,
	useScreenMode
} from '@zextras/zapp-ui';

import useLoginView from './login-view-hook';
import { useTranslation } from '../i18n/hooks';

import backgroundImage from './images/bg.jpg';
import logoChrome from './images/logo-chrome.svg';
import logoFirefox from './images/logo-firefox.svg';
import logoIE from './images/logo-internet-explorer.svg';
import logoEdge from './images/logo-edge.svg';
import logoSafari from './images/logo-safari.svg';
import logoOpera from './images/logo-opera.svg';
import logoYandex from './images/logo-yandex.svg';
import logoUC from './images/logo-ucbrowser.svg';

const LoginContainer = styled(Container)`
	padding: 0 100px;
	background: url(${backgroundImage}) no-repeat 75% center/cover;
	justify-content: center;
	align-items: flex-start;
	${({ screenMode, theme }) => screenMode === 'mobile' && css`
		padding: 0 12px;
		align-items: center;	
	`}
`;
const FormContainer = styled.div`
	max-width: 100%;
	max-height: 100vh;
	box-shadow: 0px 0px 20px -7px rgba(0,0,0,0.3);
`;
const FormWrapper = styled(Container)`
	width: auto;
	height: auto;
	background-color: #fff;
	padding: 48px 48px 0;
	width: 436px;
	max-width: 100%;
	max-height: 620px;
	height: 100vh;
	overflow-y: auto;
	${({ screenMode, theme }) => screenMode === 'mobile' && css`
		padding: 20px 20px 0;
		width: 360px;
		max-height: 100%;
		height: auto;
	`}
`;
const HelpLink = styled(Text)`
	cursor: pointer;
`;
const PrivacyLink = styled(Link)`
	text-decoration: none;
`;
const Separator = styled.div`
	width: 1px;
	height: 16px;
	margin: 0 10px 0 12px;
	background-color: #828282;
`;

export default function LoginView() {
	return (
		<ThemeProvider theme={extendTheme({ palette: {light: {}, dark: {}}})}>
			<SnackbarManager>
				<Login />
			</SnackbarManager>
		</ThemeProvider>
	);
};

function Login() {
	const { t } = useTranslation();
	const screenMode = useScreenMode();
	const [openHelpModal, setOpenHelpModal] = useState(false);

	return (
		<>
			<LoginContainer screenMode={screenMode}>
				<FormContainer>
					<FormWrapper mainAlignment="space-between" screenMode={screenMode}>
						<Container mainAlignment="flex-start" height="auto">
							<Padding value="48px 0 48px">
								<Logo />
							</Padding>
							<Padding bottom="extralarge" style={{ width: '100%' }}>
								<LoginForm />
								<Row mainAlignment="flex-start">
									<HelpLink color="primary" onClick={() => setOpenHelpModal(true)}>{ t('Help') }?</HelpLink>
									<Separator />
									<Text as={PrivacyLink} to="/" color="primary">Privacy policy</Text>
								</Row>
							</Padding>
						</Container>
						<Container crossAlignment="flex-start" height="auto" padding={{ bottom: 'extralarge' }}>
							<Text>{ t('Supported browsers') }</Text>
							<Row padding={{ top: 'medium', bottom: 'extralarge' }} wrap="nowrap">
								<Padding all="extrasmall" right="small"><Tooltip label="Chrome"><img src={logoChrome} width="18px" /></Tooltip></Padding>
								<Padding all="extrasmall" right="small"><Tooltip label="Firefox"><img src={logoFirefox} width="18px" /></Tooltip></Padding>
								<Padding all="extrasmall" right="small"><Tooltip label="Internet Explorer 11+"><img src={logoIE} width="18px" /></Tooltip></Padding>
								<Padding all="extrasmall" right="small"><Tooltip label="Edge"><img src={logoEdge} width="18px" /></Tooltip></Padding>
								<Padding all="extrasmall" right="small"><Tooltip label="Safari"><img src={logoSafari} width="18px" /></Tooltip></Padding>
								<Padding all="extrasmall" right="small"><Tooltip label="Opera"><img src={logoOpera} width="18px" /></Tooltip></Padding>
								<Padding all="extrasmall" right="small"><Tooltip label="Yandex"><img src={logoYandex} width="18px" /></Tooltip></Padding>
								<Padding all="extrasmall" right="small"><Tooltip label="UC"><img src={logoUC} width="18px" /></Tooltip></Padding>
							</Row>
							<Text size="small">Copyright &copy; { new Date().getFullYear() } Zextras, All rights reserved</Text>
						</Container>
					</FormWrapper>
				</FormContainer>
			</LoginContainer>
			<HelpModal open={openHelpModal} onClose={() => setOpenHelpModal(false)} />
		</>
	);
}

function LoginForm() {
	const {
		doLogin,
		usernameRef,
		passwordRef
	} = useLoginView();
	const { t } = useTranslation();

	const onSubmit = function(e) {
		doLogin(e);
	};

	return (
		<form onSubmit={onSubmit} style={{ width: '100%' }}>
			<Row padding={{ bottom: 'large' }}>
				<Input inputRef={usernameRef} label={t('Username')} backgroundColor="gray5" />
			</Row>
			<Row>
				<PasswordInput inputRef={passwordRef} label={t('Password')} backgroundColor="gray5" />
			</Row>
			<Row padding={{vertical: 'extralarge'}} mainAlignment="space-between">
				<Checkbox label={t('Remember me')} />
			</Row>
			<Row padding={{bottom: 'extralarge'}}>
				<Button onClick={onSubmit} label={t('Login')} size="fill" />
			</Row>
		</form>
	);
}

function HelpModal({ open, onClose }) {
	const { t } = useTranslation();
	return (
		<Modal
			title={t('Help')}
			open={open}
			onClose={onClose}
		>
			<Padding bottom="small"><Text>Do you need help?</Text></Padding>
			<Padding bottom="small"><Text>Please call this number: 1234 - 45678910</Text></Padding>
			<Padding bottom="small"><Text>Or write an email to: help.assistance@iris.com</Text></Padding>
		</Modal>
	);
}
