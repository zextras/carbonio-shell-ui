Component to use when you want to position a component in reference of another component.

```jsx
import { useState, useRef } from 'react';
import { Button, Text } from '@zextras/zapp-ui';

const [open, setOpen] = useState(false);
const buttonRef = useRef(undefined);

<>
  <Button ref={buttonRef} label="Click me!" onClick={() => setOpen(true)} />
  <Popper open={open} anchorEl={buttonRef} placement="right" onClose={() => setOpen(false)}>
    <Text>This is the content of the Popper</Text>
  </Popper>
</>
```
```jsx
import { useState, useRef } from 'react';
import { Button, Text } from '@zextras/zapp-ui';

const [open, setOpen] = useState(false);
const buttonRef = useRef(undefined);

<>
  <Button ref={buttonRef} label="Click me!" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} />
  <Popper open={open} anchorEl={buttonRef} placement="right" onClose={() => setOpen(false)} disableRestoreFocus={true}>
    <Text>This is the content of the Popper</Text>
  </Popper>
</>
```