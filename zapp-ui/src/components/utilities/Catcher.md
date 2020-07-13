This is a component that acts as Error Boundary limiting the propagation of errors to its children.

The onError function can be used to perform operations such as logging.


```jsx
import { useState } from 'react';
import { Button, Text, Container, Padding } from '@zextras/zapp-ui';

const [ evil, turnEvil ] = useState(false);

const GoodComponent = ({ good }) => {
    if (!good) {
        throw new Error('Join the dark side, accept my cookies!');
    }
    return (
        <>
            <Text size="large" color="success">I'm a good component!</Text>
        </>
    );
};

<Catcher>
    <Container width="50%">
        <Button
            icon="CodeDownload"
            label="Download virus"
            onClick={() => turnEvil(true)}
            backgroundColor="gray2"
            labelColor="error"
        />
        <Padding all="small">
            <Catcher>
                <GoodComponent good={true}/>
            </Catcher>
        </Padding>
        <Padding all="small">
            <Catcher>
                <GoodComponent good={true}/>
            </Catcher>
        </Padding>
        <Padding all="small">
            <Catcher>
                <GoodComponent good={true}/>
            </Catcher>
        </Padding>
        <Padding all="small">
            <Catcher onError={() => console.log('I caught an error')}>
                <GoodComponent good={!evil}/>
            </Catcher>
        </Padding>
        <Padding all="small">
            <Catcher>
                <GoodComponent good={true}/>
            </Catcher>
        </Padding>
        <Padding all="small">
            <Catcher>
                <GoodComponent good={true}/>
            </Catcher>
        </Padding>
    </Container>
</Catcher>
```
