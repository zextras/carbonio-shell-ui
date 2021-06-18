import React, { FC } from 'react';
import { Button, Container } from '@zextras/zapp-ui';

export const Spinner: FC = () => (
	<Container width="fill" height="fill" mainAlignment="center" crossAlignment="center">
		<Button type="ghost" label="Button" color="primary" loading />
	</Container>
);
