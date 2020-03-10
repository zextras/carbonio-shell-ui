import React, { useState } from 'react';

import tinymce from 'tinymce/tinymce';

require.context(
  'file-loader?name=tinymce/[path][name].[ext]&context=node_modules/tinymce!tinymce/skins',
  true,
  /.*/
);

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

import { Editor as _TinyMCE } from '@tinymce/tinymce-react';

// Toolbar: alignleft aligncenter alignright alignjustify |

export default function RichTextEditor({ onEditorChange }) {
    return (
        <_TinyMCE
            initialValue="<p>This is the initial content of the editor</p>"
            init={{
              skin_url: 'tinymce/skins/ui/oxide',
              content_css: 'tinymce/skins/content/default/content.css',
              height: 500,
              menubar: false,
              statusbar: false,
              branding: false,
              resize: false,
              plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace code fullscreen',
                  'insertdatetime media table paste code help'
              ],
              toolbar:
                  'formatselect | bold italic forecolor backcolor | \
                  bullist numlist outdent indent | removeformat'
            }}
            onEditorChange={onEditorChange}
        />
    );
}
