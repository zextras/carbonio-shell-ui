import React from 'react';
import { RichTextEditor as RTE } from '@zextras/zapp-ui/dist/zapp-ui.rich-text-editor';

export const RichTextEditor = (props) => <RTE {...props} baseAssetsUrl={BASE_PATH} />;
