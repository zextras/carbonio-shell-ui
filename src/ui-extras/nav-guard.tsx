/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback } from 'react';

import type { ModalProps } from '@zextras/carbonio-design-system';
import { Modal, Button } from '@zextras/carbonio-design-system';
import { filter } from 'lodash';
import { useTranslation } from 'react-i18next';
import type { BlockerFunction, Location } from 'react-router-dom';
import { useBlocker } from 'react-router-dom';

function areLocationsDifferent(loc1: Location, loc2: Location): boolean {
	return loc1.pathname !== loc2.pathname || loc1.search !== loc2.search || loc1.hash !== loc2.hash;
}

export interface RouteLeavingGuardProps {
	children: ModalProps['children'];
	when: boolean;
	onSave: () => Promise<PromiseSettledResult<Awaited<unknown>>[]>;
	dataHasError?: boolean;
}

export const RouteLeavingGuard = ({
	children,
	when,
	onSave,
	dataHasError = false
}: RouteLeavingGuardProps): React.JSX.Element => {
	const [t] = useTranslation();

	const blockerFunction: BlockerFunction = ({ currentLocation, nextLocation }) => {
		const areDifferent = areLocationsDifferent(currentLocation, nextLocation);
		return when && areDifferent;
	};

	// Block navigating elsewhere when data has been entered into the input
	const blocker = useBlocker(blockerFunction);

	const cancel = useCallback((): void => {
		blocker.reset?.();
	}, [blocker]);

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
					blocker.proceed?.();
				}
			})
			.catch((reason) => {
				console.error(reason);
				cancel();
			});
	}, [blocker, cancel, onSave]);

	const onSecondaryAction = useCallback((): void => {
		blocker.proceed?.();
	}, [blocker]);

	return (
		<Modal
			showCloseIcon
			closeIconTooltip={t('label.close', 'Close')}
			open={blocker.state === 'blocked'}
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
	);
};
