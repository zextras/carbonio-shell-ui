/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { map } from 'lodash';

export const convertToDecimal = (source: string): string => {
	let result = '';
	for (let i = 0; i < source.length; i += 1) {
		const charCode = source.charCodeAt(i);
		// Encode non-ascii or double quotes
		if (charCode > 127 || charCode === 34) {
			let temp = charCode.toString(10);
			while (temp.length < 4) {
				temp = `0${temp}`;
			}
			result += `&#${temp};`;
		} else {
			result += source.charAt(i);
		}
	}
	return result;
};

export const uploadAttachments = async (files: any): Promise<any> =>
	Promise.all(
		map(files.files, (file) =>
			fetch('/service/upload?fmt=extended,raw', {
				headers: {
					'Cache-Control': 'no-cache',
					'X-Requested-With': 'XMLHttpRequest',
					'Content-Type': `${file.type || 'application/octet-stream'};`,
					'Content-Disposition': `attachment; filename="${convertToDecimal(file.name)}"`
				},
				method: 'POST',
				body: file
			})
				.then((res) => res.text())
				// eslint-disable-next-line no-eval
				.then((txt) => eval(`[${txt}]`))
				.then((val) => ({ aid: val[2][0].aid }))
		)
	);
