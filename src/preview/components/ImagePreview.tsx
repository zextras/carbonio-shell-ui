/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useCallback, useEffect, useRef } from 'react';

import { Container, Portal, useCombinedRefs } from '@zextras/carbonio-design-system';
import styled from 'styled-components';

import FocusWithin from './FocusWithin';
import Header, { HeaderProps } from './Header';

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
	z-index: 1003;
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

const MiddleContainer = styled(Container)`
	flex-grow: 1;
`;

const Image = styled.img`
	max-height: 100%;
	max-width: 100%;
	min-height: 0;
	min-width: 0;
	align-self: center;
	filter: drop-shadow(0px 5px 14px rgba(0, 0, 0, 0.35));
	border-radius: 4px;
`;

const PreviewContainer = styled.div.attrs({
	$paddingVertical: '32px',
	$paddingHorizontal: '16px',
	$gap: '8px'
})`
	display: flex;
	max-width: 100%;
	max-height: calc(100vh - ${({ $paddingVertical }): string => $paddingVertical} * 2);
	flex-direction: column;
	gap: ${({ $gap }): string => $gap};
	justify-content: center;
	align-items: center;
	overflow: hidden;
	padding: ${({ $paddingVertical, $paddingHorizontal }): string =>
		`${$paddingVertical} ${$paddingHorizontal}`};
	outline: none;
	flex-grow: 1;
`;

type ImagePreviewProps = Partial<HeaderProps> & {
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
	/** Alternative text for image */
	alt?: string;
};

const ImagePreview = React.forwardRef<HTMLDivElement, ImagePreviewProps>(function PreviewFn(
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
		alt
	},
	ref
) {
	const previewRef: React.MutableRefObject<HTMLDivElement | null> = useCombinedRefs(ref);
	const imageRef = useRef<HTMLImageElement | null>(null);

	const escapeEvent = useCallback<(e: KeyboardEvent) => void>(
		(event) => {
			if (event.key === 'Escape') {
				onClose(event);
			}
		},
		[onClose]
	);

	useEffect(() => {
		if (show) {
			document.addEventListener('keyup', escapeEvent);
		}

		return (): void => {
			document.removeEventListener('keyup', escapeEvent);
		};
	}, [escapeEvent, show]);

	const onOverlayClick = useCallback<React.ReactEventHandler>(
		(event) => {
			// TODO: stop propagation or not?
			event.stopPropagation();
			previewRef.current &&
				!event.isDefaultPrevented() &&
				(previewRef.current === event.target ||
					!previewRef.current.contains(event.target as Node)) &&
				onClose(event);
		},
		[onClose, previewRef]
	);

	return (
		<Portal show={show} disablePortal={disablePortal} container={container}>
			<Overlay onClick={onOverlayClick}>
				<FocusWithin>
					<ExternalContainer>
						<Header
							actions={actions}
							filename={filename}
							extension={extension}
							size={size}
							closeAction={closeAction}
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
								<Image
									alt={alt ?? filename}
									src={src}
									onError={(): void => console.log('TODO handle error')}
									ref={imageRef}
								/>
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

export { ImagePreview, ImagePreviewProps };
