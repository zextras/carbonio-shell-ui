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
import React from 'react';
import AppContext from './app-context';

export default class AppErrorCatcher extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	componentDidCatch(error, info) {
		// Display fallback UI
		this.setState({ hasError: true });
		// eslint-disable-next-line react/destructuring-assignment
		this.context.fiberChannelSink('report-exception', { exception: error });
	}

	// eslint-disable-next-line react/static-property-placement
	static contextType = AppContext;

	render() {
		// eslint-disable-next-line react/destructuring-assignment
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return <h1>Something went wrong.</h1>;
		}
		// eslint-disable-next-line react/destructuring-assignment
		return this.props.children;
	}
}
