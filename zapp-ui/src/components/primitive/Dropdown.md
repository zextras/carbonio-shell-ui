
Dropdowns are toggleable, contextual overlays for displaying lists of links and more. They’re toggled by clicking.

```jsx
import { Container, Padding, Text, IconButton } from '@zextras/zapp-ui';
import { useState } from 'react';

const items = [
    {
        icon: 'Activity',
        label: 'Some Item'
    },
    {
        icon: 'Plus',
        label: 'Some  Other Item'
    }
];

const [open, setOpen] = useState(false);
<>
    <IconButton icon="ArrowDown" onClick={() => setOpen(!open)} />
    <Dropdown items={items} open={open} closeFunction={() => setOpen(false)} />
</>
```
