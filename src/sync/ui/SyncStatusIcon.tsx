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

import React, { FC, useContext } from 'react';
import { CloudQueue, CloudOff, Sync } from '@material-ui/icons';

import SyncContext from '../SyncContext';
import OfflineContext from '../../offline/OfflineContext';
import { Box, createStyles, Fade, IconButton, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			margin: theme.spacing(1),
			'&$disabled': {
				color: theme.palette.primary.contrastText
			}
		},
		disabled: {
			color: theme.palette.primary.contrastText
		},
		icon: {
			position: 'absolute',
			left: 0,
			top: 0
		},
		iconEnabled: {
			position: 'absolute',
			left: 0,
			top: 0
		}
	})
);

const SyncStatusIcon: FC<{}> = () => {
	const classes = useStyles();
	const syncContext = useContext(SyncContext);
	const offlineContext = useContext(OfflineContext);

	return (
		<IconButton
			classes={ {
				root: classes.button,
				disabled: classes.disabled
			} }
			disabled
		>
			<Box>
				<Fade
					in={ !offlineContext.isOnline }
					timeout={ 1500 }
				>
					<CloudOff className={ classes.iconEnabled }/>
				</Fade>
				<Fade
					in={ offlineContext.isOnline }
					timeout={ 1500 }
				>
					<CloudQueue className={ classes.icon }/>
				</Fade>
				<Fade
					in={ syncContext.isSyncing }
					timeout={ 1500 }
				>
					<Sync className={ classes.icon }/>
				</Fade>
			</Box>
		</IconButton>
	);
};
export default SyncStatusIcon;
