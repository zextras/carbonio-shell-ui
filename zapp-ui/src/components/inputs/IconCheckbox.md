
IconCheckboxes can be used to turn an option on or off.

It can also be used with a label description.

The Icon and status of the component depend on the checked status, whose initial value can be set via the `defaultChecked` prop.

### Controlled

```jsx
import { useState, useCallback } from 'react';
import { Button, Container } from '@zextras/zapp-ui';

const [checked1, setChecked1] = useState(false);
const [checked2, setChecked2] = useState(true);
const onChange1 = useCallback(() => setChecked1((c) => !c), []);
const onChange2 = useCallback(() => setChecked2((c) => !c), []);
const invert = useCallback(() => {
    setChecked1((c) => !c);
    setChecked2((c) => !c);
}, []);
<>
    <Button style={{marginBottom: '20px'}} onClick={invert} label="Invert state" />
    <Container orientation="horizontal" mainAlignment="flex-start" width="fill">
        <IconCheckbox value={checked1} onChange={onChange1} icon="Text" size="small" />
        <IconCheckbox value={checked2} onChange={onChange2} icon="ArrowUpward" size="small" />
        <IconCheckbox value={checked2} onChange={onChange2} icon="CheckmarkSquare" size="small" />
        <IconCheckbox value={checked2} onChange={onChange2} icon="Edit2Outline" size="small" />
        <IconCheckbox value={checked2} onChange={onChange2} icon="AttachOutline" size="small" />
    </Container>

    <Container orientation="horizontal" mainAlignment="flex-start" width="fill" style={{marginTop: '25px'}}>
        <IconCheckbox value={checked1} onChange={onChange1} icon="Text" />
        <IconCheckbox value={checked2} onChange={onChange2} icon="ArrowUpward" />
        <IconCheckbox value={checked2} onChange={onChange2} icon="CheckmarkSquare" />
        <IconCheckbox value={checked2} onChange={onChange2} icon="Edit2Outline" />
        <IconCheckbox value={checked2} onChange={onChange2} icon="AttachOutline" />
    </Container>

    <Container orientation="horizontal" mainAlignment="flex-start" width="fill" style={{marginTop: '25px'}}>
        <IconCheckbox value={checked1} onChange={onChange1} icon="Text" size="large" />
        <IconCheckbox value={checked2} onChange={onChange2} icon="ArrowUpward" size="large" />
        <IconCheckbox disabled value={checked2} onChange={onChange2} icon="CheckmarkSquare" size="large" />
        <IconCheckbox value={checked2} onChange={onChange2} icon="Edit2Outline" size="large" />
        <IconCheckbox value={checked2} onChange={onChange2} icon="AttachOutline" size="large" />
    </Container>

    <Container orientation="horizontal" mainAlignment="flex-start" width="fill" style={{marginTop: '25px'}}>
        <IconCheckbox value={checked1} onChange={onChange1} icon="Text" size="large" margin="small" />
        <IconCheckbox value={checked2} onChange={onChange2} icon="ArrowUpward" size="large" margin="small" />
        <IconCheckbox value={checked2} onChange={onChange2} icon="CheckmarkSquare" size="large" margin="small" />
        <IconCheckbox value={checked2} onChange={onChange2} icon="Edit2Outline" size="large" margin="small" />
        <IconCheckbox value={checked2} onChange={onChange2} icon="AttachOutline" size="large" margin="small" />
    </Container>
</>
```

### Uncontrolled

```jsx
import {useState} from 'react';
import {Container} from '@zextras/zapp-ui';

<>
    <Container orientation="horizontal" mainAlignment="flex-start" width="fill">
        <IconCheckbox defaultChecked={true} onChange={console.log} borderRadius="regular" icon="Text" size="small" />
        <IconCheckbox defaultChecked={false} onChange={console.log} borderRadius="regular" icon="ArrowUpward" />
        <IconCheckbox defaultChecked={true} onChange={console.log} borderRadius="regular" icon="CheckmarkSquare" size="large" />
        <IconCheckbox defaultChecked={false} onChange={console.log} borderRadius="regular" icon="Edit2Outline" size="large" margin="small" />
        <IconCheckbox defaultChecked={true} onChange={console.log} borderRadius="regular" icon="AttachOutline" size="large" margin="medium" />
    </Container>
    
    <Container orientation="horizontal" mainAlignment="flex-start" width="fill" style={{marginTop: '25px'}}>
        <IconCheckbox defaultChecked={true} onChange={console.log} icon="BookOpen" />
        <IconCheckbox defaultChecked={false} onChange={console.log} icon="Camera" label="I have a label!" />
    </Container>
</>
```
