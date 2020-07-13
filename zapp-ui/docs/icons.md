```jsx
import {useState} from 'react';
import { filter, map } from 'lodash';
import { default as icons } from 'zapp-ui-icons';
import { Icon, Container, Padding, Text, Input } from '@zextras/zapp-ui';
const iconKeys = Object.keys(icons).sort();
const [filterStr, setFilter] = useState('');
<>
    <Input label="Filter" onChange={(ev) => setFilter(ev.target.value.toLowerCase())}/>
    <Container orientation="horizontal" height="fit" width="fill" crossAlignment="center" style={{flexWrap: 'wrap', border: '1px solid #eee', borderWidth: '0 1px 1px 0'}}>
        { map(
            filter(
              iconKeys,
              (key) => key.toLowerCase().includes(filterStr)
            ),
            (key) => (
                <Container key={key} orientation="vertical" width="20%" mainAlignment="center" padding={{vertical: 'medium'}} style={{border: '1px solid #eee', borderWidth: '1px 0 0 1px'}}>
                    <Icon color="text" size="large" icon={key} />
                    <Padding top="medium"><Text size="medium"> {key} </Text></Padding>
                </Container> 
            )
        )}
    </Container>
</>
```
