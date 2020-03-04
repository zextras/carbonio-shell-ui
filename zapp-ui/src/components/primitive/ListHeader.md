A list can have a header composed by:
- Nothing if no element is selected
- [Checkbox](#checkbox) and [IconButton](#iconbutton)s when one or more elements are selected.
    - The [Checkbox](#checkbox) allow the user to select all of the elements in the list, if the selection is set to unlimited (-1).
    - [IconButton](#iconbutton)s represents the actions that can be done on the selected items.

```jsx
import Container from './Container';
import IconButton from './IconButton';
import { useState } from 'react';

const [ selecting, setSelecting ] = useState(false);
const [ allSelected, setAllSelected ] = useState(false);

const crumbs = [
   {
       label: 'Hello',
       click: () => console.log('Hello')
   },
   {
       label: 'Goodbye',
       click: () => console.log('Goodbye')
   },
   {
       label: 'Ok',
       click: () => console.log('Ok')
   }
];
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
<>
    <Container orientation="horizontal">
        <IconButton icon={selecting ? 'Square' : 'CheckmarkSquare'} onClick={() => setSelecting(!selecting)}/>
    </Container>
    <Container width="fill" background="bg_8">
        <ListHeader
            allSelected={allSelected}
            onBackClick={console.log}
            onSelectAll={() => setAllSelected(true)}
            onDeselectAll={() => setAllSelected(false)}
            selecting={selecting}
            breadCrumbs={crumbs}
            actionStack={actions}
        />
    </Container>
</>

```
