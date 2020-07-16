Input whose entered values are showed as Chip elements.

The values are added when
+ the 'space' or 'enter' key are pressed
+ ChipInput lose the focus (onBlur)

and are deleted when the 'Backspace' key is pressed.

When the internal state of the input changes the 'onChange' callback is called (with the current internal values as parameter).

The property 'value' can be passed to intialize the ChipInput internal state. 

### Controlled ChipInput

```jsx
import { useState, useRef } from 'react';
import { Button, Container, Divider, Input, Text } from '@zextras/zapp-ui';

const [contactsTo, setContactsTo] = useState([{value:'pluto'}]);
const [inputValue, setInputValue] = useState("");

const addValue = () => {
    setContactsTo([...contactsTo, {value: inputValue}]);
    setInputValue('');
};
<>
    <div>
        <Container orientation="horizontal" mainAlignment="flex-start" width="500px" padding={{bottom: 'medium'}}>
            <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} label="Contact to add" />
            <Button onClick={(e)=> addValue()} label='Add Element' />
        </Container>
        <ChipInput placeholder="To:" value={contactsTo} onChange={(values) => setContactsTo(values)} />
        <Container mainAlignment="flex-start" crossAlignment="flex-start" width="500px" padding={{top: 'medium'}}>
            <Text padding={{bottom: 'medium'}}>State value:</Text>
            { contactsTo.length > 0 &&
                <ul>
                { contactsTo.map((contact, index) =>
                    <li key={index}><Text>{contact.value}</Text></li>
                )}
                </ul>
            }
            { !contactsTo.length &&
                <Text>Empty!</Text>
            }
        </Container>
    </div>
</>
```

### Uncontrolled ChipInput

```jsx
import { useState, useRef } from 'react';
import { Button, Container, Divider, Input, Text } from '@zextras/zapp-ui';

const [logs, setLogs] = useState([]);
const onChange = (contacts) => {
    setLogs([ ...logs, {'change': contacts} ]);
};
<>
    <div>
        <ChipInput placeholder="To:" onChange={onChange} />
        <Container orientation="horizontal" mainAlignment="flex-start" crossAlignment="center" width="500px" padding={{top: 'medium', bottom: 'medium'}}>
            <Text style={{margin: '0 50px 0 0'}}>Changes log:</Text>
            <Button label="Clear" onClick={() => setLogs([]) }/>
        </Container>
        { logs.length > 0 &&
            <ul>
            { logs.map((log, index) =>
                <li key={index}><Text>{JSON.stringify(log.change)}</Text></li>
            )}
            </ul>
        }
        { !logs.length &&
            <Text>Empty!</Text>
        }
    </div>
</>
```
