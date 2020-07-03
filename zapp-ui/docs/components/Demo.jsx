import React, { useContext } from 'react';
import {
	ThemeContext,
	Container,
	Button,
	Text,
	Input,
	IconCheckbox,
	Icon
} from "../../src";

const Demo = ({}) => {
	const theme = useContext(ThemeContext);
	return (
	<Container
		padding={{ all: 'small' }}
		mainAlignment="flex-start"
		crossAlignment="flex-start"
		background="gray4"
		height="60vh"
	>
		<Button
			color="primary"
			label="Switch!"
			onClick={() => theme.setMode(theme.mode === 'dark' ? 'light' : 'dark')}
			icon={theme.mode === 'dark' ? 'Sun' : 'Moon'}
			iconColor="gray6"
		/>
		<Text size="large">{theme.mode} mode! </Text>
		<Container width="50%" height="fit">
			<Input label="Hello World"/>
		</Container>
		<Container
			orientation="horizontal"
			mainAlignment="space-evenly"
			height="fit"
		>
			<IconCheckbox icon="Activity"/>
			<IconCheckbox icon="CheckmarkCircle"/>
			<IconCheckbox icon="Car" borderRadius="round"/>
			<IconCheckbox icon="ColorPalette" disabled/>
			<IconCheckbox icon="ArrowheadRight" label="Label!"/>
		</Container>
		<Container
			orientation="horizontal"
			mainAlignment="space-evenly"
			height="fit"
		>
			<Icon size="large" icon="Activity"/>
			<Icon size="large" color="secondary" icon="CheckmarkCircle"/>
			<Icon size="large" color="error" icon="Car" />
			<Icon size="large" color="warning" icon="ColorPalette"/>
			<Icon size="large" color="success" icon="ArrowheadRight"/>
		</Container>
	</Container>
	)
};

export default Demo;
