**Has all the props of the Popper component.**

A Popover can be used to display some content on top of another.

When rendered with activateOnHover=true, it ignores the open prop and the onClose callback.
In this case, it has a fixed 300ms of delay in activation.
 
```jsx
import { useState, useRef } from 'react';
import { Button, Container, IconButton, Input, Text, Modal } from '@zextras/zapp-ui';

const [open, setOpen] = useState(false);
const buttonRef = useRef(undefined);

<>
  <Button ref={buttonRef} label="Click me!" onClick={() => setOpen(true)} />
  <Popover open={open} anchorEl={buttonRef} placement="right" onClose={() => setOpen(false)}>
    <Container>
      <Button label={"asd"} />
      <IconButton icon="Close" />
      <IconButton icon="Open" />
      <Input label={"rly"}/>
    </Container>
  </Popover>
</>
```

On hover activation example:
```jsx
import { useRef } from 'react';
import { Button, Container, IconButton, Input } from '@zextras/zapp-ui';

const buttonRef = useRef(undefined);

<>
  <Button ref={buttonRef} label="Hover me!" />
  <Popover anchorEl={buttonRef} activateOnHover={true} placement="right">
    <Container>
      <Button label={"asd"} />
      <IconButton icon="Close" />
      <IconButton icon="Open" />
      <Input label={"rly"}/>
    </Container>
  </Popover>
</>
```