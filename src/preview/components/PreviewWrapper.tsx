/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { ImagePreview, ImagePreviewProps } from './ImagePreview';
import { PdfPreview, PdfPreviewProps } from './PdfPreview';

type PreviewsProps = ImagePreviewProps | PdfPreviewProps;

type PreviewWrapperProps = PreviewsProps & {
	previewType: 'pdf' | 'image';
};

const PreviewWrapper: React.VFC<PreviewWrapperProps> = ({ previewType, ...props }) =>
	previewType === 'pdf' ? <PdfPreview {...props} /> : <ImagePreview {...props} />;

export { PreviewWrapper, PreviewWrapperProps };
