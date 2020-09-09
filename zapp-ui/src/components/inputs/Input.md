The input component works like a standard html input, and can be either [controlled](https://reactjs.org/docs/forms.html#controlled-components) or [uncontrolled](https://reactjs.org/docs/uncontrolled-components.html).
```jsx
import { useState } from 'react';
import { Container, Padding, Text, PasswordInput } from '@zextras/zapp-ui';

const [value, setValue] = useState('Some default value');

<Container orientation="horizontal" mainAlignment="center" background="gray5" height="fill" width="fill">
    <Container orientation="vertical" mainAlignment="space-around" height="300px" width="50%">
        <Input label="Input"/>
        <Input
            label="Some other Input"
            value={value}
            onChange={
                (ev) => {
                    setValue(ev.target.value)
                }
            }  
            backgroundColor="gray6"
        />        
        <PasswordInput hasError={true} label="Password"/>
        <PasswordInput disabled label="Disabled Password"/>
    </Container>    
</Container>
```
