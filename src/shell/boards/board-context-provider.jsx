/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { useCallback, useMemo, useReducer, } from 'react';
import { pickBy, set } from 'lodash';
import { useTranslation } from 'react-i18next';
import { BoardValueContext, BoardSetterContext } from './board-context';

function getRandomKey() {
	return String(Date.now() * (Math.floor(Math.random() * 1000) + 1));
}
const reducer = (state, action) => {
	switch (action.type) {
		case 'ADD_BOARD': {
			const boardKey = getRandomKey();
			const returnValue = {
				...state,
				boards: {
					[boardKey]: { url: action.payload.url, title: action.payload.title },
					...state.boards,
				},
				currentBoard: boardKey,
				minimized: false
			};
			return returnValue;
		}
		case 'REMOVE_BOARD': {
			let newCurrentBoard = state.currentBoard;
			const boardKeys = Object.keys(state.boards);
			const boardToRemove = (action.payload && action.payload.key) || state.currentBoard;
			if (state.currentBoard === boardToRemove) {
				const removedBoardIndex = boardKeys.indexOf(boardToRemove);
				newCurrentBoard = boardKeys[removedBoardIndex > 0 ? removedBoardIndex - 1 : 1];
			}
			return {
				...state,
				boards: pickBy(state.boards, (board, key) => key !== boardToRemove),
				largeView: boardKeys.length === 1 ? false : state.largeView,
				currentBoard: newCurrentBoard
			};
		}
		case 'REMOVE_ALL_BOARDS': {
			return {
				...state,
				boards: {},
				largeView: false
			};
		}
		case 'UPDATE_BOARD': {
			if (!state.boards[action.payload.key]) return state;
			const updatedBoards = { ...state.boards };
			if (action.payload.url) updatedBoards[action.payload.key].url = action.payload.url;
			if (action.payload.title) updatedBoards[action.payload.key].title = action.payload.title;
			return {
				...state,
				boards: updatedBoards
			};
		}
		case 'UPDATE_CURRENT_BOARD': {
			const updatedBoards = { ...state.boards };
			if (action.payload.url) updatedBoards[state.currentBoard].url = action.payload.url;
			if (action.payload.title) updatedBoards[state.currentBoard].title = action.payload.title;
			return {
				...state,
				boards: updatedBoards
			};
		}
		case 'SET_CURRENT_BOARD': {
			return {
				...state,
				currentBoard: action.payload.key
			};
		}
		case 'TOGGLE_LARGE_VIEW': {
			return {
				...state,
				largeView: !state.largeView
			};
		}
		case 'TOGGLE_MINIMIZED': {
			return {
				...state,
				minimized: !state.minimized
			};
		}
		default:
			console.warn('Unrecognized action type in BoardContext');
			return state;
	}
};

export default function BoardContextProvider({ children }) {
	const [ t ] = useTranslation();
	const [boardState, dispatch] = useReducer(
		reducer,
		{
			boards: {},
			currentBoard: 0,
			largeView: false,
			minimized: false
		}
	);

	const addBoard = useCallback((url, title = t('New tab')) => {
		dispatch({ type: 'ADD_BOARD', payload: { url, title } });
	}, [t]);
	const removeBoard = useCallback((key) => {
		dispatch({ type: 'REMOVE_BOARD', payload: { key } });
	}, []);
	const removeCurrentBoard = useCallback(() => {
		dispatch({ type: 'REMOVE_BOARD' });
	}, []);
	const removeAllBoards = useCallback(() => {
		dispatch({ type: 'REMOVE_ALL_BOARDS' });
	}, []);
	const updateBoard = useCallback((key, url, title) => {
		dispatch({ type: 'UPDATE_BOARD', payload: { key, url, title } });
	}, []);
	const updateCurrentBoard=useCallback((url, title) => {
		dispatch({ type: 'UPDATE_CURRENT_BOARD', payload: { url, title } });
	}, [])
	const setCurrentBoard = useCallback((key) => {
		dispatch({ type: 'SET_CURRENT_BOARD', payload: { key } });
	}, []);
	const toggleLargeView = useCallback(() => {
		dispatch({ type: 'TOGGLE_LARGE_VIEW' });
	}, []);
	const toggleMinimized = useCallback(() => {
		dispatch({ type: 'TOGGLE_MINIMIZED' });
	}, []);

	const boardSetters = useMemo(() => ({
		addBoard,
		removeBoard,
		removeCurrentBoard,
		removeAllBoards,
		updateBoard,
		setCurrentBoard,
		toggleLargeView,
		toggleMinimized,
		updateCurrentBoard
	}), [
		addBoard,
		removeAllBoards,
		removeBoard,
		removeCurrentBoard,
		setCurrentBoard,
		toggleLargeView,
		toggleMinimized,
		updateBoard, 
		updateCurrentBoard
	]);

	return (
		<BoardValueContext.Provider value={boardState}>
			<BoardSetterContext.Provider value={boardSetters}>
				{ children }
			</BoardSetterContext.Provider>
		</BoardValueContext.Provider>
	);
}
