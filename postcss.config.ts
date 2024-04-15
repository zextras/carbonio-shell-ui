/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import autoprefixer from 'autoprefixer';
import type { PostCSSLoaderOptions } from 'postcss-loader/dist/config';

const config: PostCSSLoaderOptions = {
	plugins: [autoprefixer()]
};

export default config;
