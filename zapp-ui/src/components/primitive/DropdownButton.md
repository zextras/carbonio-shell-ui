This Button works as a Dropdown toggle.

```jsx
import { Container, Padding, Text, IconButton } from '@zextras/zapp-ui';

const items = [
    {
        id: 'itm-1',
        icon: 'Activity',
        label: 'Hello World'
    },
    {
        id: 'itm-2',
        icon: 'Plus',
        label: 'Hello World Again'
    }
];

<>
    <DropdownButton label="create" items={items} />
</>
```
