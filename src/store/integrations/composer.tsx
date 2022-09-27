/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useCallback, useMemo, useRef } from 'react';
import { Container } from '@zextras/carbonio-design-system';
import styled from 'styled-components';
// TinyMCE so the global var exists
// eslint-disable-next-line no-unused-vars
import tinymce from 'tinymce/tinymce';
// this 'expression' prevents webpack from stripping it, maybe there's a better way
// eslint-disable-next-line no-unused-expressions
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
import { uploadAttachments } from './upload-attachments';

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

export const FileInput = styled.input`
	display: none;
`;

const Composer: FC<ComposerProps> = ({
	onEditorChange,
	onFileSelect,
	inline = false,
	value,
	baseAssetsUrl,
	initialValue,
	...rest
}) => {
	const _onEditorChange = useCallback(
		(newContent, editor) => {
			console.log('mnop:', { html: editor.getContent({ format: 'html' }) });
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
	const inputRef = useRef<any>();
	const onFileClick = useCallback(() => {
		if (inputRef.current) {
			inputRef.current.value = null;
			inputRef.current.click();
		}
	}, []);
	return (
		<Container
			height="100%"
			crossAlignment="baseline"
			mainAlignment="flex-start"
			style={{ overflowY: 'hidden' }}
		>
			<FileInput
				type="file"
				ref={inputRef}
				onChange={(): any => {
					console.log('mnop:', { files: inputRef?.current?.files });
					//	onFileSelect({ files: inputRef?.current?.files });
					uploadAttachments({ files: inputRef?.current?.files }).then((resp) => {
						console.log('mnop:', { resp });
						tinymce.activeEditor.insertContent('<p>Hello world!</p>');
					});
				}}
				multiple
			/>
			<Editor
				initialValue={initialValue}
				value={value}
				init={{
					content_css: `${baseAssetsUrl}/tinymce/skins/content/default/content.css`,
					// setup: (editor: any): void => {
					// 	editor.ui.registry.addButton('inlineImage', {
					// 		icon: 'gallery',
					// 		tooltip: 'Select Image',
					// 		onAction() {
					// 			onFileSelect && onFileSelect();
					// 			alert('Button clicked!');
					// 		}
					// 	});
					// },
					setup: (editor: any): void => {
						/* Menu items are recreated when the menu is closed and opened, so we need
						   a variable to store the toggle menu item state. */
						const toggleState = false;

						/* example, adding a toolbar menu button */
						editor.ui.registry.addMenuButton('imageSelector', {
							icon: 'gallery',
							tooltip: 'Select Image',
							fetch: (callback: any) => {
								const items = [
									{
										type: 'menuitem',
										icon: '',
										text: 'Add From Local',
										onAction: (): void => {
											// onFileClick();
											onFileSelect && onFileSelect(editor);
											// editor.insertContent(
											// 	'&nbsp;wdwdw <img src="cid:2bd28b55-2d45-478f-86ab-704c7823adef:31619f77-9455-41de-93c6-5b5f7a08d044" />'
											// );
										}
									}
									// {
									// 	type: 'nestedmenuitem',
									// 	text: 'Menu item 2',
									// 	icon: 'user',
									// 	getSubmenuItems: () => [
									// 		{
									// 			type: 'menuitem',
									// 			text: 'Sub menu item 1',
									// 			icon: 'unlock',
									// 			onAction: (): void => {
									// 				editor.insertContent('&nbsp;<em>You clicked Sub menu item 1!</em>');
									// 			}
									// 		},
									// 		{
									// 			type: 'menuitem',
									// 			text: 'Sub menu item 2',
									// 			icon: 'lock',
									// 			onAction: (): void => {
									// 				editor.insertContent('&nbsp;<em>You clicked Sub menu item 2!</em>');
									// 			}
									// 		}
									// 	]
									// },
									// {
									// 	type: 'togglemenuitem',
									// 	text: 'Toggle menu item',
									// 	onAction: (): void => {
									// 		toggleState = !toggleState;
									// 		editor.insertContent(
									// 			`&nbsp;<em>You toggled a menuitem ${toggleState ? 'on' : 'off'}</em>`
									// 		);
									// 	},
									// 	onSetup: (api): void => {
									// 		api.setActive(toggleState);
									// 		return function () {};
									// 	}
									// }
								];
								callback(items);
							}
						});
					},
					min_height: 350,
					auto_focus: true,
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
						  'fontselect fontsizeselect styleselect visualblocks| bold italic underline strikethrough | removeformat code | alignleft aligncenter alignright alignjustify | forecolor backcolor | bullist numlist outdent indent | ltr rtl | insertfile image | imageSelector ',
					quickbars_insert_toolbar: inline ? 'bullist numlist' : '',
					quickbars_selection_toolbar: inline
						? 'bold italic underline | forecolor backcolor | removeformat | quicklink'
						: 'quicklink',
					contextmenu: inline ? '' : '',
					toolbar_mode: 'wrap',
					// forced_root_block: false,
					// forced_root_block: '',
					content_style: `body  {  color: ${defaultStyle?.color}; font-size: ${defaultStyle?.fontSize}; font-family: ${defaultStyle?.font}; }`,
					visualblocks_default_state: false,
					end_container_on_empty_block: true
				}}
				onEditorChange={_onEditorChange}
				{...rest}
			/>
		</Container>
	);
};

export default Composer;
