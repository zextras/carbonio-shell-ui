A complete [WYSIWYG Editor](https://en.wikipedia.org/wiki/WYSIWYG).

The user can control the editing using the control bars on the top of the text area.

```jsx
<RichTextEditor
    initialValue="<p>This is the initial content of the editor</p>"
    onEditorChange={console.log}
/>
```

### Distraction free mode
The distraction free mode is an inline mode of the editor where the user still has the control over the content
but using contextual actions instead of a complete bar.
```jsx
<RichTextEditor
    inline={true}
    initialValue="<p>This is the initial content of the editor</p>"
    onEditorChange={console.log}
/>
```

Powered by [TinyMCE](https://www.tiny.cloud/docs/)
