
Dropdowns are toggleable, contextual overlays for displaying lists of links and more. They’re toggled by clicking.

```jsx
import { useMemo } from 'react';
import { Container, Padding, Text, Button, IconButton } from '@zextras/zapp-ui';

const items = [
    {
        id: 'activity-1',
        icon: 'Activity',
        label: 'Some Item',
        click: () => console.log("click1")
    },
    {
        id: 'activity-2',
        icon: 'Plus',
        label: 'Some  Other Item',
        click: () => console.log("click2")
    },
    {
        id: 'activity-3',
        icon: 'Activity',
        label: 'Some Item',
        click: () => console.log("click3")
    }
];

<>
    <Container orientation="horizontal" mainAlignment="flex-start">
        <Dropdown items={items}>
            <IconButton icon="ArrowDown" />
        </Dropdown>
        <Dropdown items={items} placement="top-end">
            <IconButton icon="ArrowUp" />
        </Dropdown>
        <Dropdown items={items} placement="left-start">
            <IconButton icon="ArrowLeft" />
        </Dropdown>
        <Dropdown items={items} placement="right-end">
            <IconButton icon="ArrowRight" />
        </Dropdown>
    </Container>
    <Dropdown items={items} placement="bottom-end">
        <Button icon="ArrowDown" label="Create" />
    </Dropdown>
</>
```
