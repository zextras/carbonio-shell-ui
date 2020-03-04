This Button works as a Dropdown toggle.

```jsx
import { Container, Padding, Text, IconButton } from '@zextras/zapp-ui';

const items = [
    {
        icon: 'Activity',
        label: 'Hello World'
    },
    {
        icon: 'Plus',
        label: 'Hello World Again'
    }
];

<>
    <DropdownButton label="create" items={items} />
</>
```
