/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useCallback, useEffect, useRef } from 'react';

import last from 'lodash/last';
import styled from 'styled-components';

const FocusContainer = styled.span`
	outline: none;
	& > * {
		outline: none;
	}
`;

interface FocusContainerProps {
	returnFocus?: boolean;
	children: React.ReactChild | React.ReactChildren;
}

const FocusWithin = ({ children, returnFocus = true }: FocusContainerProps): JSX.Element => {
	const contentRef = useRef<HTMLDivElement | null>(null);
	const startSentinelRef = useRef<HTMLDivElement | null>(null);
	const endSentinelRef = useRef<HTMLDivElement | null>(null);

	const onStartSentinelFocus = useCallback(() => {
		if (contentRef.current) {
			const node = last(contentRef.current.querySelectorAll<HTMLElement>('[tabindex]'));
			node && node.focus();
		}
	}, []);

	const onEndSentinelFocus = useCallback(() => {
		if (contentRef.current) {
			const node = contentRef.current.querySelector<HTMLElement>('[tabindex]');
			node && node.focus();
		}
	}, []);

	useEffect(() => {
		const documentElement = window.top?.document || document;
		const focusedElement = documentElement.activeElement as HTMLElement;

		contentRef.current && contentRef.current.focus();
		startSentinelRef.current &&
			startSentinelRef.current.addEventListener('focus', onStartSentinelFocus);
		endSentinelRef.current && endSentinelRef.current.addEventListener('focus', onEndSentinelFocus);
		const startSentinelRefSave = startSentinelRef.current;
		const endSentinelRefSave = endSentinelRef.current;

		return (): void => {
			startSentinelRefSave &&
				startSentinelRefSave.removeEventListener('focus', onStartSentinelFocus);
			endSentinelRefSave && endSentinelRefSave.removeEventListener('focus', onEndSentinelFocus);
			// return focus to previous initial element
			if (focusedElement && returnFocus) {
				focusedElement.focus();
			}
		};
	}, [onStartSentinelFocus, onEndSentinelFocus, returnFocus]);

	return (
		<FocusContainer>
			<span tabIndex={0} ref={startSentinelRef} />
			<div tabIndex={-1} ref={contentRef}>
				{children}
			</div>
			<span tabIndex={0} ref={endSentinelRef} />
		</FocusContainer>
	);
};

export default FocusWithin;
