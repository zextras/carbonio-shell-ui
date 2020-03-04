```jsx
import { Container, Button } from '@zextras/zapp-ui';
import { useState } from 'react';
const [ navOpen, setNavOpen ] = useState(false);
const [ selectedApp, setSelectedApp ] = useState('Mail');

const onAppSelected = (label) => setSelectedApp(label);

const tree = [
	{
		label: 'Mail',
		app: 'Mail',
		icon: 'EmailOutline',
		folders: [
			{
				label: 'Inbox',
				subfolders: [
					{
						label: 'Troubles',
						subfolders: [{ label: 'A subset of troubles' }]
					},
					{
						label: 'Newsletters'
					}
				]
			}
		],
	},
	{
		label: 'Contacts',
		app: 'Contacts',
		icon: 'PersonOutline',
		folders: [
			{
				label: 'The ones I like'
			},
			{
				label: 'The ones I don\'t',
			}
		]
	}
];

const menuTree = [
		{
				label: 'Settings',
				icon: 'Settings2',
				folders: []
		}
];

<>
	<Button 
		label="open sesame"
		onClick={() => setNavOpen(!navOpen)}
	/>
	<Container
		width="fill"
		height="900px"
		style={{ border: '1px solid black'}}
		orientation="horizontal"
		mainAlignment="flex-start"
		style={{ position: 'relative'}}
	>
		<NavigationPanel 
			tree={tree}
			menuTree={menuTree}
			selectedApp={selectedApp}
			navigationBarIsOpen={navOpen}
			onAppSelected={onAppSelected}
			onCollapserClick={() => setNavOpen(!navOpen)}
			quota={22}
		/>
	</Container>
</>
```
