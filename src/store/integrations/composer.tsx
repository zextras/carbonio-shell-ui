/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useCallback, useMemo } from 'react';
import { Container } from '@zextras/carbonio-design-system';
// TinyMCE so the global var exists
// eslint-disable-next-line no-unused-vars
import tinymce from 'tinymce/tinymce';
// this 'expression' prevents webpack from stripping it, maybe there's a better way
tinymce;

// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css';

// importing the plugin js.
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/help';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/autoresize';

import { Editor } from '@tinymce/tinymce-react';
import { useUserSettings } from '../account';

type ComposerProps = {
	/** The callback invoked when an edit is performed into the editor. `([text, html]) => {}` */
	onEditorChange?: (values: [string, string]) => void;
	/** Enable the distraction-free mode */
	inline?: boolean;
	/** The initial content of the editor */
	initialValue?: string;
	/** The content of the editor (controlled mode) */
	value?: string;
	/** The base url to append to the resource urls */
	baseAssetsUrl?: string;
};

const Composer: FC<ComposerProps> = ({
	onEditorChange,
	inline = false,
	value,
	baseAssetsUrl,
	initialValue,
	...rest
}) => {
	const _onEditorChange = useCallback(
		(newContent, editor) => {
			onEditorChange?.([
				editor.getContent({ format: 'text' }),
				editor.getContent({ format: 'html' })
			]);
		},
		[onEditorChange]
	);
	const { prefs } = useUserSettings();
	const defaultStyle = useMemo(
		() => ({
			font: prefs?.zimbraPrefHtmlEditorDefaultFontFamily,
			fontSize: prefs?.zimbraPrefHtmlEditorDefaultFontSize,
			color: prefs?.zimbraPrefHtmlEditorDefaultFontColor
		}),
		[prefs]
	);

	return (
		<Container
			height="100%"
			crossAlignment="baseline"
			mainAlignment="flex-start"
			style={{ overflowY: 'hidden' }}
		>
			<Editor
				initialValue={initialValue}
				value={value}
				init={{
					content_css: `${baseAssetsUrl}/tinymce/skins/content/default/content.css`,
					min_height: 350,
					menubar: false,
					statusbar: false,
					branding: false,
					resize: true,
					inline,
					fontsize_formats:
						'8pt 9pt 10pt 11pt 12pt 13pt 14pt 16pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt',
					object_resizing: 'img',
					style_formats: [
						{
							title: 'Headers',
							items: [
								{ title: 'h1', block: 'h1' },
								{ title: 'h2', block: 'h2' },
								{ title: 'h3', block: 'h3' },
								{ title: 'h4', block: 'h4' },
								{ title: 'h5', block: 'h5' },
								{ title: 'h6', block: 'h6' }
							]
						},
						{
							title: 'Blocks',
							items: [
								{ title: 'p', block: 'p' },
								{ title: 'div', block: 'div' },
								{ title: 'pre', block: 'pre' }
							]
						},

						{
							title: 'Containers',
							items: [
								{ title: 'section', block: 'section', wrapper: true, merge_siblings: false },
								{ title: 'article', block: 'article', wrapper: true, merge_siblings: false },
								{ title: 'blockquote', block: 'blockquote', wrapper: true },
								{ title: 'hgroup', block: 'hgroup', wrapper: true },
								{ title: 'aside', block: 'aside', wrapper: true },
								{ title: 'figure', block: 'figure', wrapper: true }
							]
						}
					],
					plugins: [
						'advlist',
						'autolink',
						'lists',
						'link',
						'image',
						'edit',
						'file',
						'charmap',
						'print',
						'preview',
						'anchor',
						'searchreplace',
						'code',
						'fullscreen',
						'insertdatetime',
						'media',
						'table',
						'paste',
						'code',
						'help',
						'quickbars',
						'directionality',
						'autoresize',
						'visualblocks'
					],

					toolbar: inline
						? false
						: // eslint-disable-next-line max-len
						  'fontselect fontsizeselect styleselect visualblocks| bold italic underline strikethrough | removeformat code | alignleft aligncenter alignright alignjustify | forecolor backcolor | bullist numlist outdent indent | ltr rtl | insertfile image ',
					quickbars_insert_toolbar: inline ? 'bullist numlist' : '',
					quickbars_selection_toolbar: inline
						? 'bold italic underline | forecolor backcolor | removeformat | quicklink'
						: 'quicklink',
					contextmenu: inline ? '' : '',
					toolbar_mode: 'wrap',
					forced_root_block: false,
					content_style: `body {  color: ${defaultStyle?.color}; font-size: ${defaultStyle?.fontSize}; font-family: ${defaultStyle?.font}; }`,
					visualblocks_default_state: true,
					end_container_on_empty_block: true
				}}
				onEditorChange={_onEditorChange}
				{...rest}
			/>
		</Container>
	);
};

export default Composer;
