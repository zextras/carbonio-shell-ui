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

import React, { FC, useContext, useState } from 'react';

import style from './LoginPage.less';
import SessionContext from '../session/SessionContext';
import {
	Container,
	CssBaseline,
	Typography,
	Paper,
	Grid,
	makeStyles,
	Theme,
	createStyles,
	FormControl, InputLabel, Input, Button
} from '@material-ui/core';
import I18nContext from '../i18n/I18nContext';

const useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			padding: theme.spacing(3, 2)
		},
		formControl: {
			margin: theme.spacing(1)
		},
		button: {
			margin: theme.spacing(1)
		}
	})
);

const LoginPage = () => {
	const [ btnDisabled, setBtnDisabled ] = useState(false);
	const { t } = useContext(I18nContext);
	const sessionCtx = useContext(SessionContext);
	const usernameRef = React.createRef();
	const passwordRef = React.createRef();
	const classes = useStyles();

	const doLogin = () => {
		if (!usernameRef.current || !passwordRef.current) return;
		setBtnDisabled(true);
		sessionCtx.doLogin(
			usernameRef.current.value,
			passwordRef.current.value
		).then(
			() => undefined
		);
	};

	return (
		<>
			<CssBaseline/>
			<Container maxWidth="sm">
				<Grid
					container
					alignContent="center"
					justify="center"
					direction="column"
					style={ { height: '100vh' } }
				>
					<Paper className={ classes.root }>
						<Typography variant="h5" component="h3">
							{ t('zextras', 'Zextras') }
						</Typography>
						<Grid
							container
							direction="column"
							justify="center"
							alignItems="center"
						>
							<FormControl
								className={ classes.formControl }
							>
								<InputLabel
									htmlFor="username">
									{ t('username', 'Username') }
								</InputLabel>
								<Input
									id="username"
									inputRef={ usernameRef }
								/>
							</FormControl>
							<FormControl
								className={ classes.formControl }>
								<InputLabel
									htmlFor="password"
								>
									{ t('password', 'Password') }
								</InputLabel>
								<Input
									id="password"
									inputRef={ passwordRef }
									type="password"
								/>
							</FormControl>
							<Button
								variant="contained"
								color="primary"
								className={ classes.button }
								onClick={ doLogin }
								disabled={ btnDisabled }
							>
								{ t('login', 'Login') }
							</Button>
						</Grid>
					</Paper>
				</Grid>
			</Container>
		</>
	);
};
export default LoginPage;
