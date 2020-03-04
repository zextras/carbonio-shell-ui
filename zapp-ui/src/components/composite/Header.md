```jsx
import { Container } from '@zextras/zapp-ui';
import { useState } from 'react';
const [ userOpen, setUserOpen ] = useState(false);
const [ navOpen, setNavOpen ] = useState(false);

<Container
	width="fill"
	height="300px"
	style={{ border: '1px solid black'}}
	orientation="vertical"
	mainAlignment="flex-start"
>
	<Header 
		createItems={[{ label: 'mail', icon: 'EmailOutline'}]}
		userItems={[{ label: 'logout', icon: 'LogOut'}]}
		quota={63}
		onMenuClick={() => setNavOpen(!navOpen)}
		onUserClick={() => setUserOpen(!userOpen)}
		navigationBarIsOpen={navOpen}
		userBarIsOpen={userOpen}
	/>
</Container>
```
```jsx
import { Container, NavigationPanel, MenuPanel } from '@zextras/zapp-ui';
import { useState } from 'react';
const [ userOpen, setUserOpen ] = useState(false);
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
				click: console.log,
				subfolders: [
					{
						label: 'Troubles',
						click: console.log,
						subfolders: [{ label: 'A subset of troubles', click: console.log }]
					},
					{
						label: 'Newsletters',
						click: console.log
					}
				]
			}
		],
	},
	{
		app: 'Contacts',
		label: 'Contacts',
		icon: 'PersonOutline',
		folders: [
			{
				label: 'The ones I like',
				click: console.log
			},
			{
				label: 'The ones I don\'t',
			}
		]
	}
];

const menuTree = [
	{
		app: 'Settings',
		label: 'Settings',
		icon: 'Settings2',
		folders: []
	}
];


<Container
	width="fill"
	height="600px"
	style={{ border: '1px solid black'}}
	orientation="vertical"
	mainAlignment="flex-start"
	crossAlignment="flex-start"
>
	<Header 
		createItems={[{ label: 'mail', icon: 'EmailOutline'}]}
		userItems={[{ label: 'logout', icon: 'LogOut'}]}
		quota={63}
		onMenuClick={() => setNavOpen(!navOpen)}
		onUserClick={() => setUserOpen(!userOpen)}
		navigationBarIsOpen={navOpen}
		userBarIsOpen={userOpen}
	/>
	<Container 
		orientation="horizontal"
		mainAlignment="space-between"
		height="fill"
		width="fill"
		style={{ position: 'relative'}}
	>
		<NavigationPanel 
			tree={tree}
			menuTree={menuTree}
			selectedApp={selectedApp}
			navigationBarIsOpen={navOpen}
			onAppSelected={onAppSelected}
			onCollapserClick={() => setNavOpen(!navOpen)}
			quota={63}
		/>
		<MenuPanel
			tree={menuTree}
			menuIsOpen={userOpen}
		/>
	</Container>
</Container>
```
