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

import React from 'react';

import style from './SplashPage.less';
import { Button, Card, CardActions, CardContent, Typography } from '@material-ui/core';

const SplashPage = () => {
	return (
		<Card>
			<CardContent>
				<Typography color="textSecondary" gutterBottom>
					Word of the Day
				</Typography>
				<Typography variant="h5" component="h2">
					benevolent
				</Typography>
				<Typography color="textSecondary">
					adjective
				</Typography>
				<Typography variant="body2" component="p">
					well meaning and kindly.
					<br/>
					{ '"a benevolent smile"' }
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small">Learn More</Button>
			</CardActions>
		</Card>
	);
};
export default SplashPage;
