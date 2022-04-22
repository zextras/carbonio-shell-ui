/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
	Container,
	IconButton,
	Portal,
	Tooltip,
	useCombinedRefs
} from '@zextras/carbonio-design-system';
import findIndex from 'lodash/findIndex';
import findLastIndex from 'lodash/findLastIndex';
import map from 'lodash/map';
import type { DocumentProps } from 'react-pdf';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import styled, { css, SimpleInterpolation } from 'styled-components';

import FocusWithin from './FocusWithin';
import Header, { HeaderProps } from './Header';
import { PreviewCriteriaAlternativeContent } from './PreviewCriteriaAlternativeContent';

const CustomIconButton = styled(IconButton)`
	${({ disabled }): SimpleInterpolation =>
		disabled &&
		css`
			background: rgba(204, 204, 204, 0.2);
			& > svg {
				background: unset;
			}
		`};
	& > svg {
		width: 20px;
		height: 20px;
	}
`;

const Overlay = styled.div`
	height: 100vh;
	max-height: 100vh;
	width: 100%;
	max-width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.8);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 3;
`;

const MiddleContainer = styled(Container)`
	flex-grow: 1;
`;

const ExternalContainer = styled.div`
	height: 100vh;
	max-height: 100vh;
	width: 100vw;
	max-width: 100vw;
	display: flex;
	flex-direction: column;
	position: relative;
`;

const Navigator = styled.div`
	display: flex;
	position: absolute;
	z-index: 1;
	bottom: 16px;
	background-color: ${({ theme }): string => theme.palette.gray0.regular};
	align-self: center;
	border-radius: 4px;
	gap: 8px;
	padding: 8px 16px;
`;

const PreviewContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	//  https://bhch.github.io/posts/2021/04/centring-flex-items-and-allowing-overflow-scroll/
	//justify-content: center;
	//align-items: center;
	// justify-content and align-items conflict with overflow management
	overflow: auto;
	outline: none;

	&::-webkit-scrollbar {
		width: 7px;
		height: 7px;
	}

	&::-webkit-scrollbar-track {
		background-color: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }): string => theme.palette.gray3.regular};
		border-radius: 4px;
	}

	& > .react-pdf__Document {
		//padding-right: 17px;
		padding-bottom: 16px;
		margin: auto;
		display: flex;
		gap: 16px;
		flex-direction: column;
	}

	& .react-pdf__message {
		color: white;
	}
`;

type PdfPreviewProps = Partial<HeaderProps> & {
	/**
	 * HTML node where to insert the Portal's children.
	 * The default value is 'window.top.document'.
	 * */
	container?: React.RefObject<HTMLElement>;
	/** Flag to disable the Portal implementation */
	disablePortal?: boolean;
	/** Flag to show or hide Portal's content */
	show: boolean;
	/** preview img source */
	src: string;
	/** Callback to hide the preview */
	onClose: (e: React.SyntheticEvent | KeyboardEvent) => void;
	/** use fallback content if you don't want to view the pdf for some reason; content can be customizable with customContent */
	useFallback?: boolean;
	/** CustomContent */
	customContent?: React.ReactElement;
	/** Whether a text layer should be rendered */
	renderTextLayer?: boolean;
	/** Src that allow open in separate tab */
	openSrc?: string;
};

const zoomStep = [800, 1000, 1200, 1400, 1600, 2000, 2400, 3200];

const PdfPreview = React.forwardRef<HTMLDivElement, PdfPreviewProps>(function PreviewFn(
	{
		src,
		show,
		container,
		disablePortal,
		extension = '',
		filename = '',
		size = '',
		actions = [],
		closeAction,
		onClose,
		useFallback = false,
		customContent,
		renderTextLayer = false,
		openSrc
	},
	ref
) {
	const previewRef: React.MutableRefObject<HTMLDivElement | null> = useCombinedRefs(ref);

	const [numPages, setNumPages] = useState<number | null>(null);

	const $closeAction = useMemo(() => {
		if (closeAction) {
			return {
				onClick: onClose,
				...closeAction
			};
		}
		return closeAction;
	}, [closeAction, onClose]);

	const onOverlayClick = useCallback<React.ReactEventHandler>(
		(event) => {
			// TODO: stop propagation or not?
			event.stopPropagation();
			(useFallback || numPages) &&
				previewRef.current &&
				!event.isDefaultPrevented() &&
				(previewRef.current === event.target ||
					!previewRef.current.contains(event.target as Node)) &&
				onClose(event);
		},
		[numPages, onClose, previewRef, useFallback]
	);

	const [currentZoom, setCurrentZoom] = useState(zoomStep[0]);
	const [incrementable, setIncrementable] = useState(true);
	const [decrementable, setDecrementable] = useState(false);
	const [fitToWidthActive, setFitToWidthActive] = useState(false);

	useEffect(() => {
		if (!show) {
			setCurrentZoom(zoomStep[0]);
			setIncrementable(true);
			setDecrementable(false);
			setFitToWidthActive(false);
		}
	}, [show]);

	const increaseOfOneStep = useCallback<React.ReactEventHandler>(
		(ev) => {
			ev.stopPropagation();
			if (incrementable) {
				const targetIndex = findIndex(zoomStep, (step) => step > currentZoom);
				if (targetIndex >= 0) {
					setCurrentZoom(zoomStep[targetIndex]);
					if (targetIndex === zoomStep.length - 1) {
						setIncrementable(false);
					}
					if (targetIndex > 0) {
						setDecrementable(true);
					}
				}
			}
			setFitToWidthActive(false);
		},
		[currentZoom, incrementable]
	);

	const decreaseOfOneStep = useCallback<React.ReactEventHandler>(
		(ev) => {
			ev.stopPropagation();
			if (decrementable) {
				const targetIndex = findLastIndex(zoomStep, (step) => step < currentZoom);
				if (targetIndex >= 0) {
					setCurrentZoom(zoomStep[targetIndex]);
					if (targetIndex === 0) {
						setDecrementable(false);
					}
					if (targetIndex < zoomStep.length - 1) {
						setIncrementable(true);
					}
				}
			}
			setFitToWidthActive(false);
		},
		[currentZoom, decrementable]
	);

	const fitToWidth = useCallback(
		(ev: Event) => {
			ev.stopPropagation();
			if (previewRef.current) {
				setCurrentZoom(previewRef.current?.clientWidth);
				setIncrementable(previewRef.current?.clientWidth < zoomStep[zoomStep.length - 1]);
				setDecrementable(previewRef.current?.clientWidth > zoomStep[0]);
				setFitToWidthActive(true);
			}
		},
		[previewRef]
	);

	useEffect(() => {
		if (show && fitToWidthActive) {
			window.addEventListener('resize', fitToWidth);
		}
		return (): void => {
			window.removeEventListener('resize', fitToWidth);
		};
	}, [fitToWidth, previewRef, show, fitToWidthActive]);

	const resetWidth = useCallback<React.ReactEventHandler>((ev) => {
		ev.stopPropagation();
		setCurrentZoom(zoomStep[0]);
		setIncrementable(true);
		setDecrementable(false);
		setFitToWidthActive(false);
	}, []);

	// could be useful for future implementations
	// const onPageLoadSuccess = useCallback(({ originalHeight, originalWidth, width, height }) => {
	// 	console.log(originalHeight, originalWidth, width, height);
	// }, []);

	const pageElements = useMemo(() => {
		if (numPages) {
			return map(new Array(numPages), (el, index) => (
				<Page
					key={`page_${index + 1}`}
					pageNumber={index + 1}
					// onLoadSuccess={index === 0 ? onPageLoadSuccess : undefined}
					width={currentZoom}
					renderTextLayer={renderTextLayer}
				/>
			));
		}
		return [];
	}, [currentZoom, numPages, renderTextLayer]);

	const onDocumentLoadSuccess = useCallback<NonNullable<DocumentProps['onLoadSuccess']>>((args) => {
		setNumPages(args.numPages);
	}, []);

	const file = useMemo(() => ({ url: src }), [src]);

	const $customContent = useMemo(() => {
		if (useFallback) {
			return (
				customContent || <PreviewCriteriaAlternativeContent downloadSrc={src} openSrc={openSrc} />
			);
		}
		return undefined;
	}, [customContent, openSrc, src, useFallback]);

	return (
		<Portal show={show} disablePortal={disablePortal} container={container}>
			<Overlay onClick={onOverlayClick}>
				<FocusWithin>
					<ExternalContainer>
						{!$customContent && (
							<Navigator onClick={(ev): void => ev.stopPropagation()}>
								<Tooltip label={decrementable ? 'Zoom out' : 'Minimum zoom level reached'}>
									<CustomIconButton
										disabled={!decrementable}
										icon="Minus"
										size="small"
										backgroundColor="gray0"
										iconColor="gray6"
										onClick={decreaseOfOneStep}
									/>
								</Tooltip>
								<Tooltip label={fitToWidthActive ? 'Reset zoom' : 'Fit to width'}>
									<CustomIconButton
										icon={fitToWidthActive ? 'MinimizeOutline' : 'MaximizeOutline'}
										size="small"
										backgroundColor="gray0"
										iconColor="gray6"
										onClick={fitToWidthActive ? resetWidth : fitToWidth}
									/>
								</Tooltip>
								<Tooltip label={incrementable ? 'Zoom in' : 'Maximum zoom level reached'}>
									<CustomIconButton
										icon="Plus"
										size="small"
										backgroundColor="gray0"
										iconColor="gray6"
										onClick={increaseOfOneStep}
										disabled={!incrementable}
									/>
								</Tooltip>
							</Navigator>
						)}
						<Header
							actions={actions}
							filename={filename}
							extension={extension}
							size={size}
							closeAction={$closeAction}
						/>
						<MiddleContainer orientation="horizontal" crossAlignment="unset" minHeight={0}>
							{/* TODO: uncomment when navigation between items will be implemented */}
							{/* <Container width="fit"> */}
							{/*	<Padding left="small" right="small"> */}
							{/*		<IconButton */}
							{/*			icon="ArrowBackOutline" */}
							{/*			size="medium" */}
							{/*			backgroundColor="gray0" */}
							{/*			iconColor="gray6" */}
							{/*			borderRadius="round" */}
							{/*		/> */}
							{/*	</Padding> */}
							{/* </Container> */}
							<PreviewContainer ref={previewRef}>
								{$customContent || (
									<Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
										{pageElements}
									</Document>
								)}
							</PreviewContainer>
							{/* TODO: uncomment when navigation between items will be implemented */}
							{/* <Container width="fit"> */}
							{/*	<Padding left="small" right="small"> */}
							{/*		<IconButton */}
							{/*			icon="ArrowForwardOutline" */}
							{/*			size="medium" */}
							{/*			backgroundColor="gray0" */}
							{/*			iconColor="gray6" */}
							{/*			borderRadius="round" */}
							{/*		/> */}
							{/*	</Padding> */}
							{/* </Container> */}
						</MiddleContainer>
					</ExternalContainer>
				</FocusWithin>
			</Overlay>
		</Portal>
	);
});

export { PdfPreview, PdfPreviewProps };
