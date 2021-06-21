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
import React, { FC } from 'react';
import { Button, Container } from '@zextras/zapp-ui';

export const Spinner: FC = () => (
	<Container width="fill" height="fill" mainAlignment="center" crossAlignment="center">
		<Button type="ghost" label="Button" color="primary" loading />
	</Container>
);
