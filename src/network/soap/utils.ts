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

import { ThemePkgDescription } from '../../db/account';
import { ZimletPkgDescription } from './types';
import { AppPkgDescription } from '../../../types';

export function zimletToAppPkgDescription(z: ZimletPkgDescription): AppPkgDescription {
	return {
		package: z.zimlet[0].name,
		name: z.zimlet[0].label,
		version: z.zimlet[0].version,
		priority: z.zimletContext[0].priority,
		resourceUrl: `/zx/zimlet/${ z.zimlet[0].name }`,
		description: z.zimlet[0].description,
		entryPoint: z.zimlet[0]['zapp-main']!,
		styleEntryPoint: z.zimlet[0]['zapp-style'],
		swExtension: z.zimlet[0]['zapp-serviceworker-extension']
	};
}

export function zimletToThemePkgDescription(z: ZimletPkgDescription): ThemePkgDescription {
	return {
		package: z.zimlet[0].name,
		name: z.zimlet[0].label,
		version: z.zimlet[0].version,
		priority: z.zimletContext[0].priority,
		resourceUrl: `/zx/zimlet/${ z.zimlet[0].name }`,
		description: z.zimlet[0].description,
		entryPoint: z.zimlet[0]['zapp-theme']!,
	};
}
