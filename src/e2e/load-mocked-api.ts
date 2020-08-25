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

export default function loadMockedApi(path: string): Promise<void> {
	return fetch(
		'_load_mocked_api_from_file',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				file: path
			})
		}
	)
		.then((r) => r.json())
		.then(({ ok, error }) => {
			if (error) { throw new Error(error); }
		});
}
