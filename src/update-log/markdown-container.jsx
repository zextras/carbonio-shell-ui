/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import styled from 'styled-components';

const Content = styled.span`
	width: 100%;
	font-family: ${({ theme }) => theme.fonts.default};
	font-size: ${({ theme }) => theme.sizes.font.medium};
	text-align: justify;
	color: ${({ theme }) => theme.palette.text.regular};
`;
const renderers = {
	text: Content
};

export default function MarkdownContainer({ content }) {
	return (
		<div>
			<ReactMarkdown plugins={[gfm]} renderers={renderers}>
				{content}
			</ReactMarkdown>
		</div>
	);
}
