/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, createContext, useReducer } from 'react';

import { ImagePreviewProps } from './ImagePreview';
import { PdfPreviewProps } from './PdfPreview';
import { PreviewWrapper, PreviewWrapperProps } from './PreviewWrapper';
import { MakeOptional } from '../utils';

type CreatePreviewArgType = (
	| MakeOptional<Omit<ImagePreviewProps, 'show'>, 'onClose'>
	| MakeOptional<Omit<PdfPreviewProps, 'show'>, 'onClose'>
) & {
	previewType: 'pdf' | 'image';
};

const PreviewsManagerContext = createContext<{
	createPreview: (args: CreatePreviewArgType) => void;
}>({
	createPreview: () => undefined
});

const PreviewManager: React.FC = ({ children }) => {
	const [previews, dispatchPreviews] = useReducer(
		(
			state: Array<React.ReactElement>,
			action: { type: 'set'; value: React.ReactElement } | { type: 'empty' }
		) => {
			switch (action.type) {
				case 'set': {
					return [...state, action.value];
				}
				case 'empty': {
					return [];
				}
				default: {
					return state;
				}
			}
		},
		[]
	);

	const createPreview = useCallback<(args: CreatePreviewArgType) => void>(
		({ onClose, ...props }) => {
			const closePreview: PreviewWrapperProps['onClose'] = (ev) => {
				if (onClose) onClose(ev);
				dispatchPreviews({ type: 'empty' });
			};

			const preview = <PreviewWrapper key={props.src} {...props} show onClose={closePreview} />;

			dispatchPreviews({
				type: 'set',
				value: preview
			});
		},
		[dispatchPreviews]
	);

	return (
		<>
			<PreviewsManagerContext.Provider value={{ createPreview }}>
				{children}
			</PreviewsManagerContext.Provider>
			{previews}
		</>
	);
};

export { PreviewsManagerContext, PreviewManager };
