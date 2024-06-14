/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useHistory } from 'react-router-dom';

import { useBridge } from '../store/context-bridge';

export const ContextBridge = (): null => {
	const history = useHistory();
	useBridge({
		functions: {
			getHistory: () => history
		}
	});
	return null;
};
