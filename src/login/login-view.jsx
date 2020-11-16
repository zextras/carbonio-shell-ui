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

/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import {
	Button,
	Checkbox,
	Container,
	extendTheme,
	Input,
	Link,
	Logo,
	Modal,
	Row,
	Padding,
	PasswordInput,
	SnackbarManager,
	Text,
	Tooltip,
	ThemeProvider,
	useScreenMode,
	useSnackbar,
	Paragraph
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

function OfflineModal({ open, onClose }) {
	const { t } = useTranslation();
	return (
		<Modal
			title="Offline"
			open={open}
			onClose={onClose}
		>
			<Paragraph>You are currently offline, please check your internet connection.</Paragraph>
		</Modal>
	);
}

function GenericErrorModal({ open, onClose }) {
	const { t } = useTranslation();
	return (
		<Modal
			title="Error"
			open={open}
			onClose={onClose}
		>
			<Paragraph>Generic error text placeholder.</Paragraph>
		</Modal>
	);
}

function LoginForm() {
	const {
		doLogin,
		usernameRef,
		passwordRef
	} = useLoginView();
	const { t } = useTranslation();
	const createSnackbar = useSnackbar();
	const [showAuthError, setShowAuthError] = useState(false);
	const [openOfflineModal, setOpenOfflineModal] = useState(false);
	const [openGenericModal, setOpenGenericModal] = useState(false);

	const onSubmit = useCallback((e) => {
		setShowAuthError(false);
		doLogin(e)
			.catch((err) => {
				if (err.message.startsWith('authentication failed')) setShowAuthError(true);
				else {
					const snackbarRef = createSnackbar(
						{
							key: String(Date.now()),
							type: 'error',
							label: 'Can not do the login now.',
							actionLabel: 'Details',
							replace: true,
							onActionClick: () => {
								window.top.navigator.onLine ? setOpenGenericModal(true) : setOpenOfflineModal(true);
								snackbarRef();
							},
							autoHideTimeout: 5000,
						}
					);
				}
			});
	}, [doLogin, createSnackbar, setShowAuthError, setOpenGenericModal, setOpenOfflineModal]);

	return (
		<>
			<form onSubmit={onSubmit} style={{ width: '100%' }}>
				<Row padding={{ bottom: 'large' }}>
					<Input inputRef={usernameRef} label={t('Username')} backgroundColor="gray5" />
				</Row>
				<Row>
					<PasswordInput inputRef={passwordRef} label={t('Password')} backgroundColor="gray5" />
				</Row>
				<Row padding={{ vertical: 'extralarge' }} mainAlignment="space-between">
					<Checkbox label={t('Remember me')} />
				</Row>
				<Row orientation="vertical" crossAlignment="flex-start" padding={{ bottom: 'extralarge' }}>
					<Button onClick={onSubmit} label={t('Login')} size="fill" />
					{ showAuthError && (
						<Padding top="small">
							<Text color="error" overflow="break-word">
								{ t('The username or password is incorrect') }
								{ t('Verify that CAPS LOCK is not on, and then retype the current username and password') }
							</Text>
						</Padding>
					)}
				</Row>
				<input type="submit" style={{ display: 'none' }} />
			</form>
			<OfflineModal open={openOfflineModal} onClose={() => setOpenOfflineModal(false)} />
			<GenericErrorModal open={openGenericModal} onClose={() => setOpenGenericModal(false)} />
		</>
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
			<Paragraph>Do you need help?</Paragraph>
			<Paragraph>
				Please call this number:
				<Link href="tel:+123445678910">1234 - 45678910</Link>
			</Paragraph>
			<Paragraph>
				Or write an email to:
				<Link href="mailto:help.assistance@iris.com" target="_blank">help.assistance@iris.com</Link>
			</Paragraph>
		</Modal>
	);
}

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
const Separator = styled.div`
	width: 1px;
	height: 16px;
	margin: 0 10px 0 12px;
	background-color: #828282;
`;

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
									<Link color="primary" size="medium" onClick={() => setOpenHelpModal(true)}>
										{ t('Help') }
									</Link>
									<Separator />
									<Link as={RouterLink} to="/" size="medium" color="primary">Privacy policy</Link>
								</Row>
							</Padding>
						</Container>
						<Container crossAlignment="flex-start" height="auto" padding={{ bottom: 'extralarge' }}>
							<Text>{ t('Supported browsers') }</Text>
							<Row padding={{ top: 'medium', bottom: 'extralarge' }} wrap="nowrap">
								<Padding all="extrasmall" right="small">
									<Tooltip label={t('supported_browsers.chrome')}>
										<img src={logoChrome} width="18px" alt={t('supported_browsers.chrome')} />
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label={t('supported_browsers.firefox')}>
										<img src={logoFirefox} width="18px" alt={t('supported_browsers.firefox')} />
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label={t('supported_browsers.ie_11_up')}>
										<img src={logoIE} width="18px" alt={t('supported_browsers.ie_11_up')} />
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label={t('supported_browsers.edge')}>
										<img src={logoEdge} width="18px" alt={t('supported_browsers.edge')} />
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label={t('supported_browsers.safari')}>
										<img src={logoSafari} width="18px" alt={t('supported_browsers.safari')} />
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label={t('supported_browsers.opera')}>
										<img src={logoOpera} width="18px" alt={t('supported_browsers.opera')} />
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label={t('supported_browsers.yandex')}>
										<img src={logoYandex} width="18px" alt={t('supported_browsers.yandex')} />
									</Tooltip>
								</Padding>
								<Padding all="extrasmall" right="small">
									<Tooltip label={t('supported_browsers.uc')}>
										<img src={logoUC} width="18px" alt={t('supported_browsers.uc')} />
									</Tooltip>
								</Padding>
							</Row>
							<Text size="small">
								{t('copyright', { year: new Date().getFullYear() })}
							</Text>
						</Container>
					</FormWrapper>
				</FormContainer>
			</LoginContainer>
			<HelpModal open={openHelpModal} onClose={() => setOpenHelpModal(false)} />
		</>
	);
}

export default function LoginView() {
	return (
		<ThemeProvider theme={extendTheme({ palette: { light: {}, dark: {} } })}>
			<SnackbarManager>
				<Login />
			</SnackbarManager>
		</ThemeProvider>
	);
}
