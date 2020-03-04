```jsx

import { default as icons } from 'zapp-ui-icons';
import { Icon, Container, Padding, Text } from '@zextras/zapp-ui';

<Container orientation="horizontal" height="fit" width="fill" crossAlignment="center" style={{flexWrap: 'wrap', border: '1px solid #eee', borderWidth: '0 1px 1px 0'}}>
    { Object.keys(icons).map( (key) => (
        <Container key={key} orientation="vertical" width="20%" mainAlignment="center" padding={{vertical: 'medium'}} style={{border: '1px solid #eee', borderWidth: '1px 0 0 1px'}}>
            <Icon color="txt_1" size="large" icon={key} />
            <Padding top="medium"><Text size="medium"> {key} </Text></Padding>
        </Container> 
    ))}
</Container>
```
