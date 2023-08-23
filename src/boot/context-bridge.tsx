/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useModal, useSnackbar } from '@zextras/carbonio-design-system';
import { useHistory } from 'react-router-dom';

import { useBridge } from '../store/context-bridge';

export const ContextBridge = (): null => {
	const history = useHistory();
	const createSnackbar = useSnackbar();
	const createModal = useModal();
	useBridge({
		functions: {
			getHistory: () => history,
			createSnackbar,
			createModal
		}
	});
	return null;
};
