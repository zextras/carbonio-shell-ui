Checkboxes can be used to turn an option on or off.

It can also be used with a label description.

The Icon and status of the component depend on the checked status, whose initial value can be set via the `defaultChecked` prop.

### Controlled

```jsx
import {useState, useCallback} from 'react';
const [checked1, setChecked1] = useState(false);
const [checked2, setChecked2] = useState(false);

const onClick1 = useCallback(() => setChecked1((c) => !c), []);
const onClick2 = useCallback(() => setChecked2((c) => !c), []);
<>
    <Checkbox value={checked1} onClick={onClick1} />
    <Checkbox value={checked2} onClick={onClick2} label="I have a label!" />
    <Checkbox value={checked2} onClick={onClick2} disabled={true} label="Disabled" />
</>
```

### Uncontrolled

```jsx
import {useState} from 'react';

<>
    <Checkbox defaultChecked={true} onChange={console.log}/>
    <Checkbox defaultChecked={false} onChange={console.log} label="I have a label!"/>
</>
```
