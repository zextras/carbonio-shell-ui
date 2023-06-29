/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useHistory } from 'react-router-dom';
import { useModal, useSnackbar } from '@zextras/carbonio-design-system';
import { useBridge } from '../store/context-bridge';

export const useContextBridge = (): void => {
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
};
