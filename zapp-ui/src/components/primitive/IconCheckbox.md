
IconCheckboxes can be used to turn an option on or off.

It can also be used with a label description.

The Icon and status of the component depend on the checked status, whose initial value can be set via the `defaultChecked` prop.

### Controlled

```jsx
import {useState} from 'react';
import {Container} from '@zextras/zapp-ui';

const [checked1, setChecked1] = useState(false);
const [checked2, setChecked2] = useState(false);

<>
    <Container orientation="horizontal" mainAlignment="flex-start" width="fill">
        <IconCheckbox defaultChecked={checked1} onClick={() => setChecked1(!checked1)} icon="Text" size="small" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="ArrowUpward" size="small" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="CheckmarkSquare" size="small" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="Edit2Outline" size="small" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="AttachOutline" size="small" />
    </Container>

    <Container orientation="horizontal" mainAlignment="flex-start" width="fill" style={{marginTop: '25px'}}>
        <IconCheckbox defaultChecked={checked1} onClick={() => setChecked1(!checked1)} icon="Text" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="ArrowUpward" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="CheckmarkSquare" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="Edit2Outline" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="AttachOutline" />
    </Container>

    <Container orientation="horizontal" mainAlignment="flex-start" width="fill" style={{marginTop: '25px'}}>
        <IconCheckbox defaultChecked={checked1} onClick={() => setChecked1(!checked1)} icon="Text" size="large" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="ArrowUpward" size="large" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="CheckmarkSquare" size="large" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="Edit2Outline" size="large" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="AttachOutline" size="large" />
    </Container>

    <Container orientation="horizontal" mainAlignment="flex-start" width="fill" style={{marginTop: '25px'}}>
        <IconCheckbox defaultChecked={checked1} onClick={() => setChecked1(!checked1)} icon="Text" size="large" margin="small" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="ArrowUpward" size="large" margin="small" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="CheckmarkSquare" size="large" margin="small" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="Edit2Outline" size="large" margin="small" />
        <IconCheckbox defaultChecked={checked2} onClick={() => setChecked2(!checked2)} icon="AttachOutline" size="large" margin="small" />
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
