/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';
import { RichTextEditor as RTE } from '@zextras/carbonio-design-system/dist/zapp-ui.rich-text-editor';

export const RichTextEditor = (props) => <RTE {...props} baseAssetsUrl={BASE_PATH} />;
