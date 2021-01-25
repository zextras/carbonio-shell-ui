import React from 'react'
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import styled from "styled-components";



const Content = styled.span`
  width: 100%;
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  text-align: justify;
  color: ${({ theme }) => theme.palette.text.regular};
`;
const renderers = {
	text: Content,
};

export default function MarkdownContainer({content}) {
	return (
		<div>
			<ReactMarkdown
				plugins={[gfm]}
				renderers={renderers}
			> 
				{content}
			</ReactMarkdown>
		</div>
	)
}
