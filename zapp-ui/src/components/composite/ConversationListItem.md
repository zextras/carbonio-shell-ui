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
const conversation = {
    attachment: true,
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
    folder: 'Inbox',
    id: '678',
    messages: ['234', '345'],
    msgCount: 2,
    unreadMsgCount: 0
};
const emails = {
    '234': {
        id: '234',
        parent: '234',
        conversation: '234',
        contacts: [
            {
                type: 'f',
                address: 'emperorcat@fear.me',
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
    },
    '345': {
        id: '345',
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
        subject: 'Long Mail Subject That Will Ellipse if it reaches the end of the container',
        fragment: 'Heloo again fellow human',
        size: 3236,
        read: false,
        attachment: true,
        flagged: true,
        urgent: true,
        bodyPath: ''
    }
};

<div style={{ width: '50%', border: '1px dashed lightgrey' }}>
    <ConversationListItem
        conversation={conversation}
        emails={emails}
        selected={selected1}
        selecting={selected1 || selected2}
        onSelect={() => setSelected1(true)}
        onDeselect={() => setSelected1(false)}
    />
</div>
```
