/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { IconButton, Text, Row, Padding, Icon, Container, Tooltip } from '@zextras/zapp-ui';
import { BoardValueContext, BoardSetterContext } from './board-context';

const TabContainer = styled(Row)`
	cursor: pointer;
	height: 28px;
	width: fit-content;
	user-select: none;
	background-color: ${({ theme, active }) =>
		active ? theme.palette.gray3.regular : theme.palette.gray5.regular};
	border-radius: 2px;
	padding: 2px 4px;
`;

export default function AppBoardTab({ idx, icon, iconSize }) {
	const { boards, currentBoard } = useContext(BoardValueContext);
	const { removeBoard, setCurrentBoard } = useContext(BoardSetterContext);
	const [t] = useTranslation();
	const onClick = useCallback(() => setCurrentBoard(idx), [idx, setCurrentBoard]);
	const onRemove = useCallback(
		(ev) => {
			ev.stopPropagation();
			removeBoard(idx);
		},
		[idx, removeBoard]
	);

	return (
		<Container orientation="row" width="fit">
			{currentBoard !== idx ? (
				<Container
					width="1px"
					heigth="fill"
					background="gray3"
					style={{ marginLeft: '4px', marginRight: '4px' }}
				/>
			) : null}
			<TabContainer active={currentBoard === idx} padding={{ all: 'extrasmall' }}>
				<Row
					height="100%"
					onClick={onClick}
					takeAvailableSpace
					mainAlignment="flex-start"
					wrap="nowrap"
				>
					<Icon icon={icon} size={iconSize} />
					<Padding right="small" />
					<Tooltip label={boards[idx].title} placement="top" maxWidth="700px">
						<Text
							size="16px"
							weight="regular"
							color={currentBoard === idx ? 'text' : 'secondary'}
							padding={{ right: 'small' }}
							width="fit"
						>
							{boards[idx].title.length > 65
								? boards[idx].title.slice(0, 65).concat('...')
								: boards[idx].title}
						</Text>
					</Tooltip>
				</Row>
				<Padding right="small" />
				<Tooltip label={t('board.close_tab', 'Close Tab')} placement="top">
					<IconButton
						iconColor="secondary"
						icon="Close"
						onClick={onRemove}
						style={{ padding: '2px', width: '24px', height: '24px' }}
					/>
				</Tooltip>
			</TabContainer>
		</Container>
	);
}
