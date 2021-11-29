/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { any } from 'prop-types';
import { ReactElement } from 'react';

type LazyBootstrapperProps = {
	onBeforeBoot?: (ctxt: DevUtilsContext) => Promise<void>;
};

export default function (props: LazyBootstrapperProps): ReactElement<LazyBootstrapperProps>;
