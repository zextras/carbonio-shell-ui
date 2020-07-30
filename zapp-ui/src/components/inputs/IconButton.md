The IconButto is a button that contains just an Icon and no label.
```jsx
import { Container } from '@zextras/zapp-ui';

const click = () => console.log('click!');

<Container orientation="vertical" mainAlignment="space-around" background="gray5" height={400} width="50%">
    <IconButton icon="Pricetags" iconColor="gray6" backgroundColor="primary" onClick={click}/>
    <IconButton iconColor="gray6" backgroundColor="gray1" icon="Plus" onClick={click}/>
    <IconButton size="large" icon="Activity" onClick={click}/>
    <IconButton size="large" icon="Activity" onClick={click} disabled />
</Container>
```
