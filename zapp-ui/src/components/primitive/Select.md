Select element maintains the same behavior of the [standard select element](https://www.w3.org/TR/2011/WD-html5-author-20110809/the-select-element.html).

His children will be built within the element, passing the options as `props`.
The dropdown menu and the items are rendered like [DropDown](#dropdown) and [DropDownItem](#dropdownitem)

```jsx
import {Input} from '@zextras/zapp-ui';
const items = [
    {
        label: 'hi',
        value: '1'
    },
    {
        label: 'hello',
        value: '2'
    },
    {
        label: 'good day',
        value: '3'
    },
    {
        label: 'goodnight',
        value: '4'
    }
];
<>
    <Select
        items={items}
        background="bg_9"
        label="Select an item"
        onChange={console.log}
        defaultSelection={items[2]}
    />
    <Input
        label="Select an item"
        backgroundColor="bg_9"
    />
</>
```
