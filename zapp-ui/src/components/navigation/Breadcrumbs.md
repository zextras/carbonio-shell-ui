Breadcrumbs allow users to make selections from a range of values.

If the Breadcrumb does not fit into the parent, the first breadcrumbs are collapsed into a `...` (three dot) element.

The `...` (three dot) element is a button, when clicked, a dropdown is shown wit the collapsed elements.
The order is defined this way:

| / | path | / | to | / | route |
|---|------|---|----|---|-------|
|   |  1   |   |  2 |   |   3   |

When collapsed, the result is defined with this order:

| ... | / | route |
|-----|---|-------|
| to  |||
| route |||

```jsx

const crumbs = [
    {
        id: 'crumb-1',
        label: 'Goodnight',
        click: () => console.log('Goodnight')
    },
    {
        id: 'crumb-2',
        label: 'Hello',
        click: () => console.log('Hello')
    },
    {
        id: 'crumb-3',
        label: 'AAAAAA',
        click: () => console.log('AAAAAA')
    },
    {
        id: 'crumb-4',
        label: 'Goodbye',
        click: () => console.log('Goodbye')
    },
    {
        id: 'crumb-5',
        label: 'Ok',
        click: () => console.log('Ok')
    }
];
<div style={{width: '50%', height: '400px', border: '1px solid grey'}}>
    <Breadcrumbs crumbs={crumbs}/>
</div>
```
