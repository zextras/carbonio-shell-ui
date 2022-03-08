/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useCallback, useEffect, useState } from 'react';
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
	const [content, setContent] = useState(initialValue);

	const _onEditorChange = useCallback(
		(newContent, editor) => {
			setContent(newContent);
			onEditorChange?.([
				editor.getContent({ format: 'text' }),
				editor.getContent({ format: 'html' })
			]);
		},
		[setContent, onEditorChange]
	);

	useEffect(() => setContent(value), [value]);

	return (
		<Container
			height="100%"
			crossAlignment="baseline"
			mainAlignment="flex-start "
			style={{ overflowY: 'hidden' }}
		>
			<Editor
				value={content}
				init={{
					skin_url: `${baseAssetsUrl}/tinymce/skins/ui/oxide`,
					content_css: `${baseAssetsUrl}/tinymce/skins/content/default/content.css`,
					min_height: 350,
					menubar: false,
					statusbar: false,
					branding: false,
					resize: true,
					inline,
					plugins: [
						'advlist',
						'autolink',
						'lists',
						'link',
						'image',
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
						'autoresize'
					],
					toolbar: inline
						? false
						: // eslint-disable-next-line max-len
						  'fontselect fontsizeselect formatselect | bold italic underline strikethrough | removeformat code | alignleft aligncenter alignright alignjustify | forecolor backcolor | bullist numlist outdent indent | ltr rtl',
					quickbars_insert_toolbar: inline ? 'bullist numlist' : '',
					quickbars_selection_toolbar: inline
						? 'bold italic underline | forecolor backcolor | removeformat | quicklink'
						: 'quicklink',
					contextmenu: inline ? '' : '',
					toolbar_mode: 'wrap'
				}}
				onEditorChange={_onEditorChange}
				{...rest}
			/>
		</Container>
	);
};

export default Composer;
