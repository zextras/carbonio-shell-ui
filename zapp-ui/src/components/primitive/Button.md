### Colors

```jsx
import { Container, Text } from '@zextras/zapp-ui';

const click = () => console.log('click!');

<Container orientation="horizontal" mainAlignment="space-around" height={400} width="fill">
    <Container orientation="vertical" mainAlignment="space-around" background="bg_9" height={400} width="30%">
        <Button label="Button" backgroundColor="bg_1" onClick={click}/>
        <Button label="Button" backgroundColor="bg_2" onClick={click}/>
        <Button label="Button" backgroundColor="bg_3" onClick={click}/>
        <Button label="Button" backgroundColor="bg_4" onClick={click}/>
        <Button label="Button" backgroundColor="bg_6" onClick={click}/>
    </Container>
    <Container orientation="vertical" mainAlignment="space-around" background="bg_9" height={400} width="30%">
        <Button label="Button" labelColor="txt_1" backgroundColor="bg_4" onClick={click}/>
        <Button label="Button" labelColor="txt_5" backgroundColor="bg_4" onClick={click}/>
        <Button label="Button" labelColor="txt_4" backgroundColor="bg_5" onClick={click}/>
        <Button label="Button" labelColor="txt_3" backgroundColor="bg_4" onClick={click}/>
        <Button label="Button" labelColor="txt_2" backgroundColor="bg_4" onClick={click}/>
    </Container>
</Container>
```

### Icon

```jsx
import { Container, Text } from '@zextras/zapp-ui';

const click = () => console.log('click!');

<Container orientation="vertical" mainAlignment="space-around" background="bg_9" height={400} width="50%">
    <Button label="Button" icon="Activity" onClick={click}/>
    <Button label="Button" icon="At" onClick={click}/>
    <Button label="Button" icon="Edit2" onClick={click}/>
    <Button label="Button" icon="Globe" onClick={click}/>
    <Button label="Button" icon="Sync" onClick={click}/>
    <Button label="Button" icon="BrushOutline" onClick={click}/>
    <Button label="Button" icon="EyeOutline" onClick={click}/>
</Container>

```

### Size

```jsx
import { Container, Text } from '@zextras/zapp-ui';

const click = () => console.log('click!');

<Container orientation="vertical" mainAlignment="space-around" background="bg_9" height={200} width="50%">
    <Button label="Button" icon="Activity" onClick={click} size="fit" />
    <Button label="Button" icon="Activity" onClick={click} size="fill" />
</Container>

```
