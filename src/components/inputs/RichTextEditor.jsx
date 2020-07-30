import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import tinymce from 'tinymce/tinymce';

import 'tinymce/themes/silver';

import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/code';
import 'tinymce/plugins/help';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/quickbars';

import { Editor as _TinyMCE } from '@tinymce/tinymce-react';

// Toolbar: alignleft aligncenter alignright alignjustify |

function RichTextEditor({ onEditorChange, inline, initialValue }) {
  const [ content, setContent ] = useState(initialValue);
  const _onEditorChange = useCallback((content, editor) => {
    setContent(content);
    onEditorChange([
      editor.getContent({format: 'text'}),
      editor.getContent({format: 'html'})
    ]);
  }, [setContent, onEditorChange]);

  return (
    <_TinyMCE
      value={content}
      init={{
        skin_url: 'tinymce/skins/ui/oxide',
        content_css: 'tinymce/skins/content/default/content.css',
        height: 500,
        menubar: false,
        statusbar: false,
        branding: false,
        resize: false,
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
          'quickbars'
        ],
        toolbar: inline ?
          false
          :
          'formatselect | bold italic underline | forecolor backcolor | \
          bullist numlist outdent indent | removeformat',
        quickbars_insert_toolbar: inline ? 'bullist numlist' : '',
        quickbars_selection_toolbar: inline ? 'bold italic underline | forecolor backcolor | removeformat | quicklink': 'quicklink',
        contextmenu: inline ? '' : '',
      }}
      onEditorChange={_onEditorChange}
    />
  );
}

RichTextEditor.propTypes = {
  /** The callback invoked when an edit is performed into the editor. `([text, html]) => {}` */
  onEditorChange: PropTypes.func,
  /** Enable the distraction-free mode */
  inline: PropTypes.bool,
  /** The initial content of the editor */
  initialValue: PropTypes.string
};

RichTextEditor.defaultProps = {
  inline: false,
  initialValue: ''
};

export default RichTextEditor;
