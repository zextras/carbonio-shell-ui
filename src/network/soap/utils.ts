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

import { ZimletPkgDescription } from './types';
import { AppPkgDescription, ThemePkgDescription } from '../../../types';

export function zimletToAppPkgDescription(z: ZimletPkgDescription): AppPkgDescription {
	return {
		package: z.zimlet[0].name,
		name: z.zimlet[0].label,
		version: z.zimlet[0]['zapp-version'] || z.zimlet[0].version,
		priority: z.zimletContext[0].priority,
		resourceUrl: `/zx/zimlet/${z.zimlet[0].name}`,
		description: z.zimlet[0].description,
		entryPoint: z.zimlet[0]['zapp-main']!,
		handlers: z.zimlet[0]['zapp-handlers']!,
		styleEntryPoint: z.zimlet[0]['zapp-style'],
		swExtension: z.zimlet[0]['zapp-serviceworker-extension']
	};
}

export function zimletToThemePkgDescription(z: ZimletPkgDescription): ThemePkgDescription {
	return {
		package: z.zimlet[0].name,
		name: z.zimlet[0].label,
		version: z.zimlet[0]['zapp-version'] || z.zimlet[0].version,
		priority: z.zimletContext[0].priority,
		resourceUrl: `/zx/zimlet/${z.zimlet[0].name}`,
		description: z.zimlet[0].description,
		entryPoint: z.zimlet[0]['zapp-theme']!,
	};
}
