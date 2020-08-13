### Colors

```jsx
import { Container, Text } from '@zextras/zapp-ui';

const click = () => console.log('click!');

<Container orientation="horizontal" mainAlignment="space-around" height={400} width="fill">
    <Container orientation="vertical" mainAlignment="space-around" background="gray5" height={400} width="30%">
        <Button label="Button" color="primary" onClick={click}/>
        <Button label="Button" color="secondary" onClick={click}/>
        <Button label="Button" color="warning" onClick={click}/>
        <Button label="Button" color="error" onClick={click}/>
        <Button label="Button" color="success" onClick={click}/>
        <Button label="Button" color="info" onClick={click}/>
    </Container>
    <Container orientation="vertical" mainAlignment="space-around" background="gray5" height={400} width="30%">
        <Button type="outlined" label="Button" color="primary" onClick={click}/>
        <Button type="outlined" label="Button" color="secondary" onClick={click}/>
        <Button type="outlined" label="Button" color="warning" onClick={click}/>
        <Button type="outlined" label="Button" color="error" onClick={click}/>
        <Button type="outlined" label="Button" color="success" onClick={click}/>
        <Button type="outlined" label="Button" color="info" onClick={click}/>
    </Container>
    <Container orientation="vertical" mainAlignment="space-around" background="gray5" height={400} width="30%">
        <Button type="ghost" label="Button" color="primary" onClick={click}/>
        <Button type="ghost" label="Button" color="secondary" onClick={click}/>
        <Button type="ghost" label="Button" color="warning" onClick={click}/>
        <Button type="ghost" label="Button" color="error" onClick={click}/>
        <Button type="ghost" label="Button" color="success" onClick={click}/>
        <Button type="ghost" label="Button" color="info" onClick={click}/>
    </Container>
</Container>
```

### Icon

```jsx
import { Container, Text } from '@zextras/zapp-ui';

const click = () => console.log('click!');

<Container orientation="horizontal" mainAlignment="space-around" height={400} width="fill">
    <Container orientation="vertical" mainAlignment="space-around" background="gray5" height={400} width="30%">
        <Button label="Button" icon="Activity" color="primary" onClick={click}/>
        <Button label="Button" icon="At" iconPlacement="left" color="secondary" onClick={click}/>
        <Button label="Button" icon="Globe" color="warning" onClick={click}/>
        <Button label="Button" icon="Sync" iconPlacement="left" color="error" onClick={click}/>
        <Button label="Button" icon="Sync" color="success" onClick={click}/>
        <Button label="Button" icon="Sync" iconPlacement="left" color="info" onClick={click}/>
    </Container>
    <Container orientation="vertical" mainAlignment="space-around" background="gray5" height={400} width="30%">
        <Button type="outlined" label="Button" icon="Activity" iconPlacement="left" color="primary" onClick={click}/>
        <Button type="outlined" label="Button" icon="At" color="secondary" onClick={click}/>
        <Button type="outlined" label="Button" icon="Globe" iconPlacement="left" color="warning" onClick={click}/>
        <Button type="outlined" label="Button" icon="Sync" color="error" onClick={click}/>
        <Button type="outlined" label="Button" icon="Sync" iconPlacement="left" color="success" onClick={click}/>
        <Button type="outlined" label="Button" icon="Sync" color="info" onClick={click}/>
    </Container>
    <Container orientation="vertical" mainAlignment="space-around" background="gray5" height={400} width="30%">
        <Button type="ghost" label="Button" icon="Activity" color="primary" onClick={click}/>
        <Button type="ghost" label="Button" icon="At" iconPlacement="left" color="secondary" onClick={click}/>
        <Button type="ghost" label="Button" icon="Globe" color="warning" onClick={click}/>
        <Button type="ghost" label="Button" icon="Sync" iconPlacement="left" color="error" onClick={click}/>
        <Button type="ghost" label="Button" icon="Sync" color="success" onClick={click}/>
        <Button type="ghost" label="Button" icon="Sync" iconPlacement="left" color="info" onClick={click}/>
    </Container>
</Container>
```

### Size

```jsx
import { Container, Text } from '@zextras/zapp-ui';

const click = () => console.log('click!');

<Container orientation="vertical" mainAlignment="space-around" background="gray5" height={200} width="50%">
    <Button label="Button" icon="Activity" onClick={click} size="fit" />
    <Button label="Button" icon="Activity" onClick={click} size="fill" />
</Container>
```

### Custom Colors

```jsx
import { Container, Text } from '@zextras/zapp-ui';

const click = () => console.log('click!');

<Container orientation="horizontal" mainAlignment="space-around" height={400} width="fill">
    <Container orientation="vertical" mainAlignment="space-around" background="gray5" height={400} width="30%">
        <Button label="Button" labelColor="text" backgroundColor="gray1" onClick={click}/>
        <Button label="Button" labelColor="error" backgroundColor="gray1" onClick={click}/>
        <Button label="Button" labelColor="secondary" backgroundColor="gray2" onClick={click}/>
        <Button label="Button" labelColor="gray6" backgroundColor="gray1" onClick={click}/>
        <Button label="Button" labelColor="primary" backgroundColor="gray1" onClick={click}/>
    </Container>
</Container>
```

### Disabled

```jsx
import { Container, Text } from '@zextras/zapp-ui';

const click = () => console.log('click!');

<Container orientation="horizontal" mainAlignment="space-around" height={400} width="fill">
    <Container orientation="vertical" mainAlignment="space-around" background="gray5" height={400} width="30%">
        <Button label="Button" color="primary" onClick={click} disabled />
        <Button label="Button" color="secondary" onClick={click} disabled />
        <Button label="Button" color="warning" onClick={click} disabled />
        <Button label="Button" color="error" onClick={click} disabled />
        <Button label="Button" color="success" onClick={click} disabled />
        <Button label="Button" color="info" onClick={click} disabled />
    </Container>
    <Container orientation="vertical" mainAlignment="space-around" background="gray5" height={400} width="30%">
        <Button type="outlined" label="Button" color="primary" onClick={click} disabled />
        <Button type="outlined" label="Button" color="secondary" onClick={click} disabled />
        <Button type="outlined" label="Button" color="warning" onClick={click} disabled />
        <Button type="outlined" label="Button" color="error" onClick={click} disabled />
        <Button type="outlined" label="Button" color="success" onClick={click} disabled />
        <Button type="outlined" label="Button" color="info" onClick={click} disabled />
    </Container>
    <Container orientation="vertical" mainAlignment="space-around" background="gray5" height={400} width="30%">
        <Button type="ghost" label="Button" color="primary" onClick={click} disabled />
        <Button type="ghost" label="Button" color="secondary" onClick={click} disabled />
        <Button type="ghost" label="Button" color="warning" onClick={click} disabled />
        <Button type="ghost" label="Button" color="error" onClick={click} disabled />
        <Button type="ghost" label="Button" color="success" onClick={click} disabled />
        <Button type="ghost" label="Button" color="info" onClick={click} disabled />
    </Container>
</Container>
```
