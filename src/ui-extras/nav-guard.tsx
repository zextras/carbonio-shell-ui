/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useState, useMemo, useCallback, useRef } from 'react';

import type { ModalProps } from '@zextras/carbonio-design-system';
import { Modal, Button } from '@zextras/carbonio-design-system';
import type { Location } from 'history';
import { filter } from 'lodash';
import { Prompt, useHistory } from 'react-router-dom';

import { getT } from '../store/i18n/hooks';

export interface RouteLeavingGuardProps {
	children: ModalProps['children'];
	when?: boolean;
	onSave: () => Promise<PromiseSettledResult<Awaited<unknown>>[]>;
	dataHasError?: boolean;
}

export const RouteLeavingGuard = ({
	children,
	when,
	onSave,
	dataHasError = false
}: RouteLeavingGuardProps): React.JSX.Element => {
	const history = useHistory();
	const lastLocationInitial = useMemo(() => history.location, [history]);
	const [modalVisible, setModalVisible] = useState(false);
	const lastLocationRef = useRef(lastLocationInitial);
	const confirmedNavigationRef = useRef(false);
	const t = getT();
	const cancel = useCallback((): void => {
		setModalVisible(false);
		confirmedNavigationRef.current = false;
	}, []);

	const confirmNavigation = useCallback(() => {
		confirmedNavigationRef.current = true;
		if (lastLocationRef.current) {
			// Navigate to the previous blocked location with your navigate function
			history.push(lastLocationRef.current);
		}
	}, [history]);

	const handleBlockedNavigation = useCallback(
		(nextLocation: Location): boolean => {
			if (
				!confirmedNavigationRef.current &&
				`${nextLocation.pathname}${nextLocation.search || ''}` !==
					`${history.location.pathname}${history.location.search}`
			) {
				setModalVisible(true);
				lastLocationRef.current = nextLocation;
				return false;
			}
			return true;
		},
		[history.location.pathname, history.location.search]
	);

	const onConfirm = useCallback((): void => {
		onSave()
			.then((results) => {
				const rejected = filter(
					results,
					(result): result is PromiseRejectedResult => result.status === 'rejected'
				);
				if (rejected.length > 0) {
					console.error(rejected);
					cancel();
				} else {
					setModalVisible(false);
					confirmNavigation();
				}
			})
			.catch((reason) => {
				console.error(reason);
				cancel();
			});
	}, [cancel, confirmNavigation, onSave]);

	const onSecondaryAction = useCallback((): void => {
		setModalVisible(false);
		confirmNavigation();
	}, [confirmNavigation]);

	return (
		<>
			<Prompt when={when} message={handleBlockedNavigation} />
			{/* Your own alert/dialog/modal component */}
			<Modal
				showCloseIcon
				closeIconTooltip={t('label.close', 'Close')}
				open={modalVisible}
				title={
					dataHasError
						? t('label.cannot_save_changes', 'Some changes cannot be saved')
						: t('label.unsaved_changes', 'You have unsaved changes')
				}
				onClose={cancel}
				onConfirm={dataHasError ? onSecondaryAction : onConfirm}
				confirmLabel={
					dataHasError
						? t('label.leave_anyway', 'Leave anyway')
						: t('label.save_and_leave', 'Save and leave')
				}
				onSecondaryAction={dataHasError ? cancel : onSecondaryAction}
				secondaryActionLabel={
					dataHasError ? t('label.cancel', 'Cancel') : t('label.leave_anyway', 'Leave anyway')
				}
				optionalFooter={
					!dataHasError ? (
						<Button
							color="secondary"
							type="outlined"
							label={t('label.cancel', 'Cancel')}
							onClick={cancel}
						/>
					) : undefined
				}
			>
				{children}
			</Modal>
		</>
	);
};
