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

export interface Theme {
	breakpoints: {
		width: number;
		aspectRatio: number
	};
	borderRadius: string;
	fonts: {
		default: string;
		weight: {
			regular: number,
			medium: number,
			bold: number
		}
	},
	sizes: {
		font: { [path: string]: string };
		icon: { [path: string]: string };
		padding: { [path: string]: string };
	};
	icons: { [path: string]: any };
	loginBackground: string;
	colors: {
		background: { [path: string]: string };
		disabled: { [path: string]: string };
		hover: { [path: string]: string };
		text: { [path: string]: string };
		feedback: { [path: string]: string };
		border: { [path: string]: string };
		highlight: { [path: string]: string };
		status: { [path: string]: string };
		avatar: { [path: string]: string };
	};
};
