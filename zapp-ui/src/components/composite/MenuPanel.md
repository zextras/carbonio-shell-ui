```jsx
import { Container, Button, Responsive } from '@zextras/zapp-ui';
import { useState } from 'react';
const [ open, setOpen ] = useState(false);

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
				label: 'The ones I like',
				click: console.log
			},
			{
				label: 'The ones I don\'t',
				click: console.log
			}
		]
	}
];

<>
	<Button
		label="open sesame"
		onClick={() => setOpen(!open)}
	/>
	<Container
		width="fill"
		height="900px"
		style={{ border: '1px solid black'}}
		orientation="horizontal"
		mainAlignment="flex-start"
		style={{ position: 'relative'}}
	>
		<MenuPanel
			tree={tree}
			menuIsOpen={open}
		/>
	</Container>
	<Responsive mode="mobile"> I appear only in desktop mode! </Responsive>
</>
```
