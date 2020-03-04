The IconButto is a button that contains just an Icon and no label.
```jsx
import { Container } from '@zextras/zapp-ui';

const click = () => console.log('click!');

<Container orientation="vertical" mainAlignment="space-around" background="bg_9" height={400} width="50%">
    <IconButton icon="Pricetags" iconColor="txt_3" backgroundColor="bg_1" onClick={click}/>
    <IconButton iconColor="txt_3" backgroundColor="bg_4" icon="Plus" onClick={click}/>
    <IconButton size="large" icon="Activity" onClick={click}/>
</Container>
```
