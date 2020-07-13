The Modal is the component that appears in front of app content to provide critical information or ask for decisions, and informs the user about a task.

The Modal requires decisions to be taken and can involve multiple tasks which have a clear start and end points.

This component helps also to prevent critical errors (for example when deleting an element) and to get user’s attention.

#### Simple Modal
```jsx
import { useState } from 'react';
import { Button, Checkbox, Text } from '@zextras/zapp-ui';

const [open, setOpen] = useState(false);
const clickHandler = () => setOpen(true);
const closeHandler = () => setOpen(false);

<>
    <Button label="Trigger Modal" onClick={clickHandler}/>
    <Modal
        title="Title_bold_dark"
        open={open}
        onConfirm={closeHandler}
        onClose={closeHandler}
    >
        <Text overflow="break-word">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
    </Modal>
</>
```


#### Error Modal
```jsx
import { useState } from 'react';
import { Button, Checkbox, Text } from '@zextras/zapp-ui';

const [open, setOpen] = useState(false);
const clickHandler = () => setOpen(true);
const closeHandler = () => setOpen(false);

<>
    <Button label="Trigger Modal" onClick={clickHandler}/>
    <Modal
        type="error"
        title="Title_bold_dark"
        open={open}
        onConfirm={closeHandler}
        onClose={closeHandler}
    >
        <Text overflow="break-word">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
    </Modal>
</>
```

#### Centered Error Modal
```jsx
import { useState } from 'react';
import { Button, Checkbox, Text } from '@zextras/zapp-ui';

const [open, setOpen] = useState(false);
const clickHandler = () => setOpen(true);
const closeHandler = () => setOpen(false);

<>
    <Button label="Trigger Modal" onClick={clickHandler}/>
    <Modal
        type="error"
        title="Title_bold_dark"
        open={open}
        centered
        onConfirm={closeHandler}
        onClose={closeHandler}
    >
        <Text overflow="break-word">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
    </Modal>
</>
```

#### Confirmation Modal
```jsx
import { useState } from 'react';
import { Button, Checkbox, Text } from '@zextras/zapp-ui';

const [open, setOpen] = useState(false);
const clickHandler = () => setOpen(true);
const closeHandler = () => setOpen(false);

<>
    <Button label="Trigger Modal" onClick={clickHandler}/>
    <Modal
        title="Title_bold_dark"
        open={open}
        dismissLabel="Cancel"
        onConfirm={closeHandler}
        confirmLabel="Proceed"
        onClose={closeHandler}
        optionalFooter={<Checkbox label="Never ask again!" />}
    >
        <Text overflow="break-word">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
    </Modal>
</>
```

#### Multiple Actions
```jsx
import { useState } from 'react';
import { Button, Checkbox, Text } from '@zextras/zapp-ui';

const [open, setOpen] = useState(false);
const clickHandler = () => setOpen(true);
const closeHandler = () => setOpen(false);

<>
    <Button label="Trigger Modal" onClick={clickHandler}/>
    <Modal
        title="Title_bold_dark"
        open={open}
        onConfirm={closeHandler}
        confirmLabel="Main Action"
        onSecondaryAction={closeHandler}
        secondaryActionLabel="Secondary Action"
        onClose={closeHandler}
    >
        <Text overflow="break-word">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
    </Modal>
</>
```

#### Nested Modal (Never use)
```jsx
import { useState } from 'react';
import { Button, Text } from '@zextras/zapp-ui';

const [open1, setOpen1] = useState(false);
const [open2, setOpen2] = useState(false);
const clickHandler1 = () => setOpen1(true);
const clickHandler2 = () => setOpen2(true);
const closeHandler1 = () => setOpen1(false);
const closeHandler2 = () => setOpen2(false);

<>
    <Button label="Trigger Modal" onClick={clickHandler1}/>
    <Modal size="medium" title="Modal 1" open={open1} confirmLabel="Open 2nd Modal" onConfirm={clickHandler2} onClose={closeHandler1}>
        <Text overflow="break-word">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
    </Modal>
    <Modal title="Modal 2" open={open2} onClose={closeHandler2}>
        <Text overflow="break-word">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
    </Modal>
</>
```
