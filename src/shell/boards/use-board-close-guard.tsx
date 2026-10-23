/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect } from 'react';

import styled from '@emotion/styled';
import { Container, Icon, Padding, Row, Text, useModal } from '@zextras/carbonio-design-system';
import { filter, map } from 'lodash';
import { useShallow } from 'zustand/react/shallow';

import { onBeforeShellExit } from '../../network/before-shell-exit';
import { useAppStore } from '../../store/app';
import { closeAllBoards, closeBoard, setCurrentBoard, useBoardStore } from '../../store/boards';
import { getBoardIcon, hasPendingChanges } from '../../store/boards/utils';
import { getT } from '../../store/i18n/hooks';
import type { Board } from '../../types/boards';

const ScrollableList = styled(Container)`
	overflow-y: auto;
`;

// The modal never exceeds the viewport height minus this margin
const MODAL_MAX_HEIGHT = 'calc(100vh - 80px)';
// Approximate height taken by the modal content other than the list (title, text, buttons, paddings)
const MODAL_FIXED_CONTENT_HEIGHT = '16rem';
const LIST_MIN_HEIGHT = '5rem';
const LIST_MAX_HEIGHT = '11rem';

const UNSAVED_CHANGES_MODAL_ID = 'board-unsaved-changes';

const getBoardsWithPendingChanges = (ids?: string[]): Board[] => {
	const { boards, orderedBoards } = useBoardStore.getState();
	// follow the order of the tabs, so that the first item is the leftmost tab
	const candidates = map(ids ?? orderedBoards, (id) => boards[id]);
	return filter(candidates, (board) => hasPendingChanges(board));
};

/**
 * Content of the modal shown when closing all the boards. It follows the store, so that
 * the list is always up to date with the boards which would lose their changes.
 * The modal is dismissed on its own when no board has unsaved changes anymore.
 */
const UnsavedBoardsContent = ({ onEmpty }: { onEmpty: () => void }): React.JSX.Element | null => {
	const t = getT();
	const apps = useAppStore((s) => s.apps);
	const boardsWithPendingChanges = useBoardStore(
		useShallow((s) =>
			filter(
				map(s.orderedBoards, (id) => s.boards[id]),
				(board) => hasPendingChanges(board)
			)
		)
	);
	const isEmpty = boardsWithPendingChanges.length === 0;

	useEffect(() => {
		if (isEmpty) {
			onEmpty();
		}
	}, [isEmpty, onEmpty]);

	if (isEmpty) {
		return null;
	}

	return (
		<Container crossAlignment="flex-start" gap="1rem" padding={{ vertical: 'small' }}>
			<Text overflow="break-word">
				{t('board.unsaved_changes.close_board_message', {
					// plain default for the plural categories other than one/other (e.g. few, many, two)
					defaultValue:
						'These {{count}} items have unsaved changes. If you close the board now, the changes will be lost.',
					defaultValue_one:
						'This item has unsaved changes. If you close the board now, the changes will be lost.',
					defaultValue_other:
						'These {{count}} items have unsaved changes. If you close the board now, the changes will be lost.',
					count: boardsWithPendingChanges.length
				})}
			</Text>
			<ScrollableList
				orientation="vertical"
				mainAlignment="flex-start"
				crossAlignment="flex-start"
				gap="0.5rem"
				height="auto"
				minHeight={LIST_MIN_HEIGHT}
				maxHeight={`clamp(${LIST_MIN_HEIGHT}, calc(100vh - 80px - ${MODAL_FIXED_CONTENT_HEIGHT}), ${LIST_MAX_HEIGHT})`}
				tabIndex={0}
				role="list"
				aria-label={t('board.unsaved_changes.items_list_label', 'Items with unsaved changes')}
			>
				{map(boardsWithPendingChanges, (board) => (
					<Row key={board.id} role="listitem" gap="0.5rem" data-testid={`unsaved-item-${board.id}`}>
						<Icon icon={getBoardIcon(board)} size="large" />
						<Text>{board.title}</Text>
						<Text color="secondary">
							{t('board.from_app', 'From {{app}}', {
								app: apps[board.app]?.display ?? board.app
							})}
						</Text>
					</Row>
				))}
			</ScrollableList>
		</Container>
	);
};

type BoardCloseGuard = {
	/** Close the board, asking for confirmation first if the board has unsaved changes */
	requestCloseBoard: (id: string) => void;
	/** Close all the boards, asking for confirmation first if at least one has unsaved changes */
	requestCloseAllBoards: () => void;
};

export const useBoardCloseGuard = (): BoardCloseGuard => {
	const t = getT();
	const { createModal, closeModal } = useModal();

	const openConfirmationModal = useCallback(
		(
			title: string,
			children: React.JSX.Element,
			onConfirm: () => void,
			onKeepEditing?: () => void
		) => {
			createModal({
				id: UNSAVED_CHANGES_MODAL_ID,
				title,
				confirmLabel: t('board.unsaved_changes.close_and_discard', 'Close and discard'),
				confirmColor: 'error',
				dismissLabel: t('board.unsaved_changes.keep_editing', 'Keep editing'),
				showCloseIcon: true,
				// the confirm button is focused by default: keep the focus on the modal to avoid discarding by mistake
				focusModalContent: true,
				maxHeight: MODAL_MAX_HEIGHT,
				onConfirm: () => {
					onConfirm();
					closeModal(UNSAVED_CHANGES_MODAL_ID);
				},
				onClose: () => {
					closeModal(UNSAVED_CHANGES_MODAL_ID);
					onKeepEditing?.();
				},
				children
			});
		},
		[closeModal, createModal, t]
	);

	const askTabCloseConfirmation = useCallback(
		(board: Board, onConfirm: () => void) => {
			openConfirmationModal(
				t('board.unsaved_changes.close_tab_title', 'Close {{title}}?', { title: board.title }),
				<Padding all="small">
					<Text overflow="break-word">
						{t(
							'board.unsaved_changes.close_tab_message',
							'{{title}} has unsaved changes. If you close it now, the changes will be lost.',
							{ title: board.title }
						)}
					</Text>
				</Padding>,
				onConfirm
			);
		},
		[openConfirmationModal, t]
	);

	const askBoardCloseConfirmation = useCallback(
		(onConfirm: () => void, onKeepEditing: () => void) => {
			openConfirmationModal(
				t('board.unsaved_changes.close_board_title', 'Close the board?'),
				<UnsavedBoardsContent onEmpty={(): void => closeModal(UNSAVED_CHANGES_MODAL_ID)} />,
				onConfirm,
				onKeepEditing
			);
		},
		[closeModal, openConfirmationModal, t]
	);

	const requestCloseBoard = useCallback(
		(id: string) => {
			const [board] = getBoardsWithPendingChanges([id]);
			if (board) {
				askTabCloseConfirmation(board, () => closeBoard(id));
			} else {
				closeBoard(id);
			}
		},
		[askTabCloseConfirmation]
	);

	const requestCloseAllBoards = useCallback(() => {
		if (getBoardsWithPendingChanges().length > 0) {
			askBoardCloseConfirmation(closeAllBoards, () => {
				// show the user where the unsaved changes are
				const [firstBoardWithPendingChanges] = getBoardsWithPendingChanges();
				if (firstBoardWithPendingChanges) {
					setCurrentBoard(firstBoardWithPendingChanges.id);
				}
			});
		} else {
			closeAllBoards();
		}
	}, [askBoardCloseConfirmation]);

	return { requestCloseBoard, requestCloseAllBoards };
};

/**
 * While at least one board has unsaved changes, register a beforeunload handler
 * which prevents the user from losing them by closing the tab/browser.
 * The handler is removed as soon as no board is dirty.
 */
export const useBoardsBeforeUnload = (): void => {
	const anyPendingChanges = useBoardStore((s) =>
		Object.values(s.boards).some((board) => hasPendingChanges(board))
	);
	useEffect(() => {
		if (!anyPendingChanges) {
			return undefined;
		}
		const handler = (event: BeforeUnloadEvent): void => {
			event.preventDefault();
			// legacy browsers require returnValue to be set
			// eslint-disable-next-line no-param-reassign
			event.returnValue = '';
		};
		window.addEventListener('beforeunload', handler);
		// the shell leaves the page on its own (logout, session expired): don't prompt the user
		const unsubscribe = onBeforeShellExit(() => {
			window.removeEventListener('beforeunload', handler);
		});
		return (): void => {
			unsubscribe();
			window.removeEventListener('beforeunload', handler);
		};
	}, [anyPendingChanges]);
};
