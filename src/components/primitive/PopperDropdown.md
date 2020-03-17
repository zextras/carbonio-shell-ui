
Dropdowns are toggleable, contextual overlays for displaying lists of links and more. They’re toggled by clicking.

```jsx
import { Container, Padding, Text, Button, IconButton } from '@zextras/zapp-ui';

const items = [
    {
        id: 'activity-1'
        icon: 'Activity',
        label: 'Some Item'
    },
    {
        id: 'activity-2'
        icon: 'Plus',
        label: 'Some  Other Item'
    },
    {
        id: 'activity-3'
        icon: 'Activity',
        label: 'Some Item'
    }
];

<>
    <div>
        <PopperDropdown items={items}>
            <IconButton icon="ArrowDown" />
        </PopperDropdown>
        <PopperDropdown items={items} placement="top-end">
            <IconButton icon="ArrowUp" />
        </PopperDropdown>
        <PopperDropdown items={items} placement="left-start">
            <IconButton icon="ArrowLeft" />
        </PopperDropdown>
        <PopperDropdown items={items} placement="right-end">
            <IconButton icon="ArrowRight" />
        </PopperDropdown>
    </div>
    <PopperDropdown items={items} placement="bottom-end">
        <Button icon="ArrowDown" label="Create" />
    </PopperDropdown>
</>
```