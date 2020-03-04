
Checkboxes can be used to turn an option on or off.

It can also be used with a label description.

The Icon and status of the component depend on the checked status, whose initial value can be set via the `defaultChecked` prop.

### Controlled

```jsx
import {useState} from 'react';
const [checked1, setChecked1] = useState(false);
const [checked2, setChecked2] = useState(false);

<>
    <Checkbox defaultChecked={checked1} onClick={() => setChecked1(!checked1)}/>
    <Checkbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} label="I have a label!"/>
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
