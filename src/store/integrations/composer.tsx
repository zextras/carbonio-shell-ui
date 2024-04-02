/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useCallback, useMemo, useRef } from 'react';

import { Editor, IAllProps as EditorProps } from '@tinymce/tinymce-react';
import { Container } from '@zextras/carbonio-design-system';
import styled from 'styled-components';
import type { EditorOptions, TinyMCE, Ui } from 'tinymce/tinymce';
// TinyMCE so the global var exists
import tinymce from 'tinymce/tinymce';
import 'tinymce/models/dom';
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css';
// importing the plugin js.
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/wordcount';

import { SUPPORTED_LOCALES } from '../../constants/locales';
import { useUserSettings } from '../account';
import { getT, useI18nStore } from '../i18n';

type ComposerProps = EditorProps & {
	/** The callback invoked when an edit is performed into the editor. `([text, html]) => {}` */
	onEditorChange?: (values: [string, string]) => void;
	/** Enable the distraction-free mode */
	inline?: boolean;
	/** The initial content of the editor */
	initialValue?: EditorProps['initialValue'];
	/** The content of the editor (controlled mode) */
	value?: EditorProps['value'];
	/**
	 * Callback called when user choose some file from the os.
	 * If defined, a menu item to add inline images is added to the composer.
	 */
	onFileSelect?: (arg: { editor: TinyMCE; files: HTMLInputElement['files'] | undefined }) => void;
	customInitOptions?: Partial<EditorProps['init']>;
};

export const FileInput = styled.input`
	display: none;
`;

const Composer: FC<ComposerProps> = ({
	onEditorChange,
	onFileSelect,
	inline = false,
	value,
	initialValue,
	customInitOptions,
	...rest
}) => {
	const _onEditorChange = useCallback<NonNullable<EditorProps['onEditorChange']>>(
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
	const inputRef = useRef<HTMLInputElement>(null);
	const onFileClick = useCallback(() => {
		if (inputRef.current) {
			inputRef.current.value = '';
			inputRef.current.click();
		}
	}, []);
	const t = getT();
	const { locale } = useI18nStore.getState();
	const language = useMemo(() => {
		const localeObj =
			locale in SUPPORTED_LOCALES && SUPPORTED_LOCALES[locale as keyof typeof SUPPORTED_LOCALES];
		return (
			(localeObj &&
				(('tinymceLocale' in localeObj && localeObj?.tinymceLocale) || localeObj?.value)) ||
			locale
		);
	}, [locale]);
	const inlineLabel = useMemo(() => t('label.add_inline_image', 'Add inline image'), [t]);

	const setupCallback = useCallback<NonNullable<EditorOptions['setup']>>(
		(editor) => {
			if (onFileSelect)
				editor.ui.registry.addMenuButton('imageSelector', {
					icon: 'gallery',
					tooltip: t('label.select_image', 'Select image'),
					fetch: (callback) => {
						const items: Ui.Menu.MenuItemSpec[] = [
							{
								type: 'menuitem',
								text: inlineLabel,
								onAction: (): void => {
									onFileClick();
								}
							}
						];
						callback(items);
					}
				});
		},
		[inlineLabel, onFileClick, onFileSelect, t]
	);

	const editorInitConfig = useMemo<EditorProps['init']>(
		() => ({
			content_css: `${BASE_PATH}/tinymce/skins/content/default/content.css`,
			language_url: `${BASE_PATH}tinymce/langs/${language}.js`,
			language,
			setup: setupCallback,
			min_height: 350,
			auto_focus: true,
			menubar: false,
			statusbar: false,
			branding: false,
			resize: true,
			inline,
			font_size_formats:
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
				'charmap',
				'preview',
				'anchor',
				'searchreplace',
				'code',
				'fullscreen',
				'insertdatetime',
				'media',
				'table',
				'code',
				'help',
				'quickbars',
				'directionality',
				'autoresize',
				'visualblocks'
			],
			toolbar: inline
				? false
				: [
						'fontfamily fontsize styles visualblocks',
						'bold italic underline strikethrough',
						'removeformat code',
						'alignleft aligncenter alignright alignjustify',
						'forecolor backcolor',
						'bullist numlist outdent indent',
						'ltr rtl',
						'insertfile image',
						'imageSelector'
					].join(' | '),
			quickbars_insert_toolbar: inline ? 'bullist numlist' : '',
			quickbars_selection_toolbar: inline
				? 'bold italic underline | forecolor backcolor | removeformat | quicklink'
				: 'quicklink',
			contextmenu: '',
			toolbar_mode: 'wrap',
			content_style: `body  {  color: ${defaultStyle?.color}; font-size: ${defaultStyle?.fontSize}; font-family: ${defaultStyle?.font}; }`,
			visualblocks_default_state: false,
			end_container_on_empty_block: true,
			relative_urls: false,
			remove_script_host: false,
			newline_behavior: 'default',
			browser_spellcheck: true,
			convert_unsafe_embeds: true,
			...customInitOptions
		}),
		[
			language,
			setupCallback,
			inline,
			defaultStyle?.color,
			defaultStyle?.fontSize,
			defaultStyle?.font,
			customInitOptions
		]
	);

	const fileInputOnChange = useCallback((): void => {
		onFileSelect?.({ editor: tinymce, files: inputRef?.current?.files });
	}, [onFileSelect]);

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
				accept="image/*"
				onChange={fileInputOnChange}
				multiple
			/>

			<Editor
				initialValue={initialValue}
				value={value}
				init={editorInitConfig}
				onEditorChange={_onEditorChange}
				{...rest}
			/>
		</Container>
	);
};

export default Composer;
