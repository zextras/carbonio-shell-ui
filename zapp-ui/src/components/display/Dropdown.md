
Dropdowns are toggleable, contextual overlays for displaying lists of links and more. They’re toggled by clicking.

Dropdown list items can be customized with components and/or disabled.
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
        label: 'Some Other Item',
        click: () => console.log("click2"),
        disabled: true
    },
    {
        id: 'activity-3',
        icon: 'Activity',
        label: 'Yet Another Item',
        click: () => console.log("click3")
    },
    {
        id: 'activity-4',
        icon: 'Activity',
        label: 'Some Item',
        customComponent: <Button label="click me!" onClick={() => console.log("click4")}/>
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

### Development status:
```jsx noEditor
import { Container, Icon } from '@zextras/zapp-ui';
import StatusTable from 'status-table';
const items = [{
    feature: 'Test',
    status: 2,
    notes: 'This is how the development status checklist table will appear'
},
{
    feature: 'Some completed feature',
    status: 1,
    notes: 'Completed!'
},
{
    feature: 'Something missing',
    status: 3,
    notes: ''
},
];

<StatusTable items={items} />

```