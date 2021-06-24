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
