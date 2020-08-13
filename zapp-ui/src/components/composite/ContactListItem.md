```jsx
import {useState} from 'react';
const [selected1, setSelected1] = useState(false);
const [selected2, setSelected2] = useState(false);
const actions = [
    {
        icon: 'Activity',
        label: 'Action',
        click: console.log
    },
    {
        icon: 'Globe',
        label: 'Action',
        click: console.log
    },
    {
        icon: 'Plus',
        label: 'Action',
        click: console.log
    },
];

<div style={{ width: '50%', border: '1px dashed lightgrey' }}>
<ContactListItem
    contact={
        {
            firstName: 'Mario',
            lastName: 'Super',
            email: 'ifixyourpipes@gmail.com',
            jobTitle: 'Lead Plumber',
            department: 'Peach\'s Castle' 
        }
    }
    selected={selected1}
    onSelect={() => setSelected1(true)}
    onDeselect={() => setSelected1(false)}
    actions={actions}
/>
<ContactListItem
    contact={
        {
            firstName: 'bg',
            lastName: 'url',
            image: 'example.jpg',
            email: 'cssmasher@gmail.com',
            jobTitle: 'Mascot',
            department: 'zapp-ui design system'
        }
    }
    selected={selected2}
    onSelect={() => setSelected2(true)}
    onDeselect={() => setSelected2(false)}
    actions={actions}
/>
</div>
```
