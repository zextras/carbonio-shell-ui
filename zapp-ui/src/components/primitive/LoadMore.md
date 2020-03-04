This Component is displayed at the bottom of a list.

```jsx
import { Container, List } from '@zextras/zapp-ui';

<Container orientation="vertical" mainAlignment="space-around" background="bg_9" height="fit" width="60%">
    <LoadMore label="Loading..." onRender={() => console.log('You saw me!')}/>
</Container>
```

```jsx
import { useState } from 'react';
import { Container, List, Divider, Text } from '@zextras/zapp-ui';
const numbers = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
const [data, setData] = useState(numbers);

const itemFactory = ({ index }) => {
    return (
        <>
            <Container
                key={index}
                height="64px"
                orientation="horizontal"
                mainAlignment="flex-start"
                background="bg_9"
                padding={{ all: 'small' }}
            >
                <Container
                    width="32px"
                    height="32px"
                    borderRadius="round"
                    background="bg_2"
                />
                <Container
                    width="fit"
                    padding={{ all: 'medium' }}
                >
                    <Text>{data[index]}</Text>
                </Container>
            </Container>
            <Divider color='bd_3'/>
        </>
    );
}
// The list will be rendered
<Container height="400px" width="50%" background="bg_8">
    <List
        Factory={itemFactory}
        amount={data.length}
        footer={() => <LoadMore label="Hello"/>}
    />
</Container>
```
