Accordions allow the user to browse nested menus and folder structures.

Every item in an Accordion must have a label, while icons and click callbacks are optional.

If the user clicks on the arrow icon, the accordion shows its items list, without triggering the callback

If the user clicks on the label or container, the accordion shows its content and fires the relative callback (e.g. the sidebar items perform an history push to another route).

Once open, clicking on the arrow icon collapses the accordion without triggering the callback.

### Plain Accordion
```jsx
import { Container, Text } from '@zextras/zapp-ui';

const items = [{ id: '1', label: 'One Accordion' },{ id: '2', label: 'Two Accordion' }];

<Container orientation="vertical" mainAlignment="space-around" background="gray5" height="fit" width={306}>
	<Accordion items={items} label="Accordion" />
</Container>
```

### Accordion with icons
```jsx
import { Container, Text } from '@zextras/zapp-ui';

const items = [
    {
        id: '1',
        label: 'One Accordion',
        icon: 'CheckmarkCircleOutline',
        items: [
            {
                id: '1',
                label: 'Nested Accordion',
                icon: 'TrendingDown'
            },
            {
                id: '2',
                label: 'Another Nested Accordion',
                icon: 'AlertTriangleOutline'
            },
            {
                id: '3',
                label: 'Accordions!',
                icon: 'MicOff'
            }
        ]
    },
    {
        id: '2',
        label: 'Two Accordion',
        icon: 'Attach',
    }
];

<Container orientation="vertical" mainAlignment="space-around" background="gray5" height="fit" width={306}>
	<Accordion items={items} icon="Activity" label="Accordion" />
</Container>
```

### Active Accordion with read/unread badge 
```jsx
import { Container, Text } from '@zextras/zapp-ui';

const items = [{ id: '1', label: 'One Accordion', badgeCounter: 10 },{ id: '2', label: 'Two Accordion', badgeType: "unread", badgeCounter: 100 }];

<>
    <Container orientation="vertical" mainAlignment="space-around" background="gray5" height="fit" width={306}>
	    <Accordion active={true} items={items} label="Accordion" divider={true} badgeCounter={100} />
    </Container>
    <Container orientation="vertical" mainAlignment="space-around" background="gray5" height="fit" width={306}>
	    <Accordion active={true} items={items} label="Accordion" divider={true} badgeType="unread" badgeCounter={100} />
    </Container>
    <Container orientation="vertical" mainAlignment="space-around" background="gray5" height="fit" width={306}>
	    <Accordion icon="EmailOutline" active={true} items={items} label="Accordion" badgeType="unread" badgeCounter={100} />
    </Container>
</>
```

### Real example Accordion
```jsx
import { Container, Text } from '@zextras/zapp-ui';

const items = [
    {
        id: 'inbox',
        label: 'Inbox',
        badgeType: "unread",
        badgeCounter: 10,
        items: [
            {
                id: 'starred',
                label: 'Starred',
                badgeCounter: 2        
            },
            {
                id: 'important',
                label: 'Important',
                badgeType: "unread",
                badgeCounter: 8        
            }
        ]
    },
    {
        id: 'spam',
        label: 'Spam',
        badgeCounter: 100
    }
];

<>
    <Container orientation="vertical" mainAlignment="space-around" background="gray5" height="fit" width={306}>
	    <Accordion active={true} items={items} divider={true} label="mario.rossi@zextras.com" badgeType="unread" badgeCounter={100} />
        <Accordion active={false} items={items} label="giuseppe.verdi@zextras.com" badgeType="unread" badgeCounter={100} />
    </Container>
</>
```
