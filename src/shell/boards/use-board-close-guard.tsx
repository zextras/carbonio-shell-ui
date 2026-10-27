/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect } from 'react';

import styled from '@emotion/styled';
import { Container, Icon, Modal, Padding, Row, Text } from '@zextras/carbonio-design-system';
import { filter, map } from 'lodash';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { onBeforeShellExit } from '../../network/before-shell-exit';
import { useAppStore } from '../../store/app';
import { closeAllBoards, closeBoard, setCurrentBoard, useBoardStore } from '../../store/boards';
import { getBoardIcon, hasPendingChanges } from '../../store/boards/utils';
import { getT } from '../../store/i18n/hooks';
import type { Board } from '../../types/boards';

// The modal never exceeds the viewport height minus this margin
const MODAL_VIEWPORT_MARGIN = '5rem';
const MODAL_MAX_HEIGHT = `calc(100vh - ${MODAL_VIEWPORT_MARGIN})`;
const LIST_MIN_HEIGHT = '5rem';
const LIST_MAX_HEIGHT = '11rem';
// The modal is about 27.7rem high with the list at its max height: below this viewport height
// it doesn't fit, so its body scrolls and the list must not scroll on its own
const LIST_SCROLL_MIN_VIEWPORT_HEIGHT = '37.5rem';

const ScrollableList = styled(Container)`
	overflow-y: auto;
	max-height: ${LIST_MAX_HEIGHT};

	@media (max-height: ${LIST_SCROLL_MIN_VIEWPORT_HEIGHT}) {
		max-height: none;
		overflow-y: visible;
	}
`;

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

type CloseRequest = { type: 'board'; id: string } | { type: 'all' };

type CloseRequestState = {
	/** The close request waiting for the user confirmation */
	request?: CloseRequest;
};

const useCloseRequestStore = create<CloseRequestState>()(() => ({}));

const askConfirmation = (request: CloseRequest): void => {
	useCloseRequestStore.setState({ request });
};

const dismissConfirmation = (): void => {
	useCloseRequestStore.setState({ request: undefined });
};

const requestCloseBoard = (id: string): void => {
	if (getBoardsWithPendingChanges([id]).length > 0) {
		askConfirmation({ type: 'board', id });
	} else {
		closeBoard(id);
	}
};

const requestCloseAllBoards = (): void => {
	if (getBoardsWithPendingChanges().length > 0) {
		askConfirmation({ type: 'all' });
	} else {
		closeAllBoards();
	}
};

type BoardCloseGuard = {
	/** Close the board, asking for confirmation first if the board has unsaved changes */
	requestCloseBoard: (id: string) => void;
	/** Close all the boards, asking for confirmation first if at least one has unsaved changes */
	requestCloseAllBoards: () => void;
};

/**
 * The confirmation is shown by BoardCloseConfirmation, which must be rendered
 * once in the board container.
 */
export const useBoardCloseGuard = (): BoardCloseGuard => ({
	requestCloseBoard,
	requestCloseAllBoards
});

const BoardTabCloseContent = ({
	boardId,
	onEmpty
}: {
	boardId: string;
	onEmpty: () => void;
}): React.JSX.Element | null => {
	const t = getT();
	const board = useBoardStore((s) => s.boards[boardId]);
	const hasChanges = hasPendingChanges(board);

	useEffect(() => {
		if (!hasChanges) {
			onEmpty();
		}
	}, [hasChanges, onEmpty]);

	if (!board) {
		return null;
	}

	return (
		<Padding all="small">
			<Text overflow="break-word">
				{t(
					'board.unsaved_changes.close_tab_message',
					'{{title}} has unsaved changes. If you close it now, the changes will be lost.',
					{ title: board.title }
				)}
			</Text>
		</Padding>
	);
};

/**
 * Ask the user to confirm the closing of the boards which have unsaved changes.
 * It is a controlled modal rendered by the shell, so it doesn't rely on a ModalManager
 * and it is always translated with the shell i18n.
 */
export const BoardCloseConfirmation = (): React.JSX.Element | null => {
	const t = getT();
	const request = useCloseRequestStore((s) => s.request);
	const boardTitle = useBoardStore((s) =>
		request?.type === 'board' ? s.boards[request.id]?.title : undefined
	);

	const keepEditing = useCallback(() => {
		dismissConfirmation();
		if (request?.type === 'all') {
			// show the user where the unsaved changes are
			const [firstBoardWithPendingChanges] = getBoardsWithPendingChanges();
			if (firstBoardWithPendingChanges) {
				setCurrentBoard(firstBoardWithPendingChanges.id);
			}
		}
	}, [request]);

	const discard = useCallback(() => {
		// dismiss first: the onClose of a board can throw, and the modal must not stay open
		dismissConfirmation();
		if (request?.type === 'board') {
			closeBoard(request.id);
		} else if (request?.type === 'all') {
			closeAllBoards();
		}
	}, [request]);

	if (!request) {
		return null;
	}

	return (
		<Modal
			open
			title={
				request.type === 'board'
					? t('board.unsaved_changes.close_tab_title', 'Close {{title}}?', { title: boardTitle })
					: t('board.unsaved_changes.close_board_title', 'Close the board?')
			}
			confirmLabel={t('board.unsaved_changes.close_and_discard', 'Close and discard')}
			confirmColor="error"
			dismissLabel={t('board.unsaved_changes.keep_editing', 'Keep editing')}
			showCloseIcon
			// the confirm button is focused by default: keep the focus on the modal to avoid discarding by mistake
			focusModalContent
			maxHeight={MODAL_MAX_HEIGHT}
			onConfirm={discard}
			onClose={keepEditing}
		>
			{request.type === 'board' ? (
				<BoardTabCloseContent boardId={request.id} onEmpty={dismissConfirmation} />
			) : (
				<UnsavedBoardsContent onEmpty={dismissConfirmation} />
			)}
		</Modal>
	);
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
