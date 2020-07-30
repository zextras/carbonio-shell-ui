A list can have a header composed by:
- Nothing if no element is selected
- [Checkbox](#checkbox) and [IconButton](#iconbutton)s when one or more elements are selected.
    - The [Checkbox](#checkbox) allow the user to select all of the elements in the list, if the selection is set to unlimited (-1).
    - [IconButton](#iconbutton)s represents the actions that can be done on the selected items.

```jsx
import Container from '../layout/Container';
import IconButton from '../inputs/IconButton';
import { useState } from 'react';

const [ selecting, setSelecting ] = useState(false);
const [ allSelected, setAllSelected ] = useState(false);

const crumbs = [
   {
       id: 'itm-1',
       label: 'Hello',
       click: () => console.log('Hello')
   },
   {
       id: 'itm-2',
       label: 'Goodbye',
       click: () => console.log('Goodbye')
   },
   {
       id: 'itm-3',
       label: 'Ok',
       click: () => console.log('Ok')
   }
];
const actions = [
    {
        id: 'itm-1',
        icon: 'Activity',
        label: 'Action 1',
        onActivate: console.log,
    },
    {
        id: 'itm-2',
        icon: 'Globe',
        label: 'Action 2',
        onActivate: console.log,
    },
    {
        id: 'itm-3',
        icon: 'Plus',
        label: 'Action 3',
        onActivate: console.log,
    },
    {
        id: 'itm-4',
        icon: 'AlertCircle',
        label: 'Action 4',
        onActivate: console.log,
    },
    {
        id: 'itm-5',
        icon: 'Archive',
        label: 'Action 5',
        onActivate: console.log,
    },
    {
        id: 'itm-6',
        icon: 'CloudDownload',
        label: 'Action 6',
        onActivate: console.log,
    },
    {
        id: 'itm-7',
        icon: 'ColorPicker',
        label: 'Action 7',
        onActivate: console.log,
    },
];
<>
    <Container orientation="horizontal">
        <IconButton icon={selecting ? 'Square' : 'CheckmarkSquare'} onClick={() => setSelecting(!selecting)}/>
    </Container>
    <Container width="fill" background="gray3">
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
