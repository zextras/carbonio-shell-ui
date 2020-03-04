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
const email1 = {
    id: '234',
	parent: '234',
    conversation: '234',
    contacts: [
        {
            type: 'f',
            address: 'email@example.com',
            displayName: 'Catto the Fearsome'
        }
    ],
    date: (new Date(Date.now() - 500000)).toDateString(),
    subject: 'Food, Human.',
    fragment: 'Hello, fellow human. I require Cheezburger. Now. ASAP. I\'ll puke on the nice shoes this time, i swear.',
    size: 3236,
    read: true,
    attachment: true,
    flagged: true,
    urgent: true,
    bodyPath: ''
};
const email2 = {
    id: '234',
	parent: '234',
    conversation: '234',
    contacts: [
        {
            type: 'f',
            address: 'email@example.com',
            displayName: 'PropTypes.string'
        }
    ],
    date: (new Date(Date.now() - 50000)).toDateString(),
    subject: 'GodFuckingDamnLongMailSubjectThatWillEllipseOrISwearToGodIllFuckingKillTheIdiotWhoInventedInternet',
    fragment: 'Heloo again fellow human',
    size: 3236,
    read: false,
    attachment: true,
    flagged: true,
    urgent: true,
    bodyPath: ''
};

<div style={{ width: '50%', border: '1px dashed lightgrey' }}>
    <EmailListItem
        email={email1}
        folder="Inbox"
        selected={selected1}
        selecting={selected1 || selected2}
        actions={actions}
        onSelect={() => setSelected1(true)}
        onDeselect={() => setSelected1(false)}
    />
    <EmailListItem
        email={email2}
        folder="Inbox"
        selected={selected2}
        selecting={selected1 || selected2}
        actions={actions}
        onSelect={() => setSelected2(true)}
        onDeselect={() => setSelected2(false)}
    />
</div>
```
