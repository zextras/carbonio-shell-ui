Accordions allow the user to browse nested menus and folder structures.

Every item in an Accordion must have a label, while icons and click callbacks are optional.

If the user clicks on the arrow icon, the accordion shows its items list, without triggering the callback

If the user clicks on the label or container, the accordion shows its content and fires the relative callback (e.g. the sidebar items perform an history push to another route).

Once open, clicking on the arrow icon collapses the accordion without triggering the callback.

### Plain Accordion
```jsx
import { Container, Text } from '@zextras/zapp-ui';

const items = [{ label: 'One Accordion' },{ label: 'Two Accordion' }];

<Container orientation="vertical" mainAlignment="space-around" background="bg_9" height="fit" width={256}>
	<Accordion items={items} label="Accordion" />
</Container>
```

### Accordion with icons
```jsx
import { Container, Text } from '@zextras/zapp-ui';

const items = [
    {
        label: 'One Accordion',
        icon: 'CheckmarkCircleOutline',
        items: [
            {
                label: 'Nested Accordion',
                icon: 'BookOutline'
            },
            {
                label: 'Another Nested Accordion',
                icon: 'BookOpenOutline'
            },
            {
                label: 'Accordions!',
                icon: 'AwardOutline'
            }
        ]
    },
    {
        label: 'Two Accordion',
        icon: 'Attach',
    }
];

<Container orientation="vertical" mainAlignment="space-around" background="bg_9" height="fit" width={256}>
	<Accordion items={items} icon="Activity" label="Accordion" />
</Container>
```
