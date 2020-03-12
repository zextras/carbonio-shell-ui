This is a component that simplifies the control of components that should appear or disappear. 

```jsx
import { Icon, Button, Padding } from '@zextras/zapp-ui';
import { useState } from 'react';
let [open, setOpen] = useState(true);
const toggle = () => { 
    setOpen(!open);
};

<>
    <Button onClick={toggle} label="Click Me!"/>
    <Padding all="large">
        <Collapse orientation="vertical" open={open} maxSize="100px">
            <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>   
            <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
            <Icon icon="Activity" size="large"/>
            <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
        </Collapse>
    </Padding>
    <Padding all="large">
        <Collapse orientation="horizontal" open={open} maxSize="50px">
            <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>
            <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
            <Icon icon="Activity" size="large"/>
            <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
        </Collapse>
    </Padding>
</>
```
