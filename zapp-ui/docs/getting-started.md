This documentation page serves as a starting point for the successful integration and use of the Zextras Design System.
It will be incrementally expanded over time to accomodate tips, procedures and solutions to common problems that come up with the deployment and use of the library.

## Under the hood

The Zextras Design System is entirely made of React function components loaded with [hooks](https://reactjs.org/docs/hooks-intro.html) and styled with [`styled-components`](https://styled-components.com/).

## Input Control
[Controlled input](https://reactjs.org/docs/forms.html#controlled-components)

[Uncontrolled input](https://reactjs.org/docs/uncontrolled-components.html)

Every input component (checkbox, select, etc) can be used in either controlled and uncontrolled mode by using different props.

Usually uncontrolled components receive a default state, and emit change events, while controlled inputs work by latching event callbacks on events like `click` and `keypress` to update the value from a controller component. 

## Integration
The Zextras Design System exposes React components, but can also be integrated in Preact projects by following the [compat guide](https://preactjs.com/guide/v10/switching-to-preact/#setting-up-compat).

Usually, to insert components into your project you just need to insert the `ThemeProvider` somewhere higher in the component hierarchy and, if you code runs from inside an iframe, you will also need to use `styled-components`' `StyleSheetManager` specifying a `target` prop.

The following is an example wrapper component: 
``` jsx static
function StyledWrapper({ extension, children }) {
    return (
        <StyleSheetManager target={window.top.document.head}>
            <ThemeProvider theme={extendTheme(extension)}>
                {children}
            </ThemeProvider>
        </StyleSheetManager>
    );
}
```

Ideally, you should use only one wrapper at a time, so if you use components on multiple parts of the DOM try to use a single wrapper around a common root.

## Refs

All the components of the DS accept a ref.

## Theming

Most of the styling rules of the Zextras Design System are defined inside the default theme map. This map contains the colors and sizes that are used by the components in a neatly organized structure.
The map can be customized or expanded by passing an extension object to the `ThemeProvider` that will expose a theme obtained with the merging of the two objects.  

#### Example:
This example shows how to add a color to the theme. A future version will allow devs to specify only one of the two regular colors and will populate the other shades automatically. 
```jsx static

const override = {
    palette: {
        light: {
            team: {
                regular: '#0088C1',
                hover: '#00638e',
                active: '#005174',
                focus: '#00638e',
                disabled: '#99e0ff'
            }
        },
        dark: {
            team: {
                regular: '#71d4ff',
                hover: '#a4e4ff',
                active: '#beebff',
                focus: '#a4e4ff',
                disabled: '#365663'
            }
        }
    }
};

function StyledWrapper({ children }) {
    return (
        <ThemeProvider theme={extendTheme(override)}>
            {children}
        </ThemeProvider>
    );
}

```
