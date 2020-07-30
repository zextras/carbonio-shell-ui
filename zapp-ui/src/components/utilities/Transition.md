```jsx
import { useState } from 'react';
import { Button, Container, IconButton, Row, Text, Tooltip } from '@zextras/zapp-ui';

const effects = [...Transition.types];
const [buttons, setButtons] = useState(effects.reduce((acc, currentValue) => { return { ...acc, [currentValue]: false }}, {}));

<>
    <Container crossAlignment="unset">
      { effects.map((effect, index) => {
        return (
          <React.Fragment key={index}>
            <Text size="large" style={{ textTransform: 'capitalize', paddingBottom: '8px' }}>{ effect }</Text>
            <Row padding={{bottom: 'large'}}>
              <Row width="40px">
                <Tooltip label={effect} placement="left">
                  <IconButton
                    icon="PlayCircle"
                    onClick={() => {
                      setButtons({ ...buttons, [effect]: !buttons[effect] });
                    }}
                  />
                </Tooltip>
              </Row>
              <Row takeAvailableSpace={true}>
                <Transition type={effect} apply={buttons[effect]}>
                  <Button color="error" label={effect} />
                </Transition>
              </Row>
            </Row>
          </React.Fragment>
        );
      })}
    </Container>
</>
```
```jsx
import { useState } from 'react';
import { Button, Container, IconButton, Row, Text, Tooltip } from '@zextras/zapp-ui';
const [open, setOpen] = useState(false);
<>
  <Container crossAlignment="unset">
    <Text size="large">Custom easing and timing</Text>
    <Row padding={{bottom: 'large'}}>
      <Row width="40px">
        <IconButton
          icon="PlayCircle"
          onClick={() => setOpen(!open)}
        />
      </Row>
      <Row takeAvailableSpace={true}>
        <Transition
          type="fade"
          apply={open}
          transitionTiming="ease-in"
          transitionDuration={1000}
        >
          <Button color="error" label="Button" />
        </Transition>
      </Row>
    </Row>
  </Container>
</>
```

```jsx
import { useState, useReducer } from 'react';
import { Button, Container, Select, Padding, Text, Row } from '@zextras/zapp-ui';

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return [ ...state, action.value ];
    case 'reset':
      return [];
    default:
      throw new Error();
  }
}
const effects = [...Transition.types];
const selectItems = effects.reduce((acc, currentValue) => [...acc, { label: currentValue, value: currentValue }], []);
const [toDos, dispatch] = useReducer(reducer, []);
const [effect, setEffect] = useState('fade');

<>
  <Container crossAlignment="flex-start" orientation="horizontal">
    <Row orientation="vertical" width="40%">
      <Select items={selectItems} defaultSelection={{ label: 'fade', value: 'fade' }} onChange={(value) => setEffect(value)} label="Select an effect" />
      <Row width="100%" mainAlignment="flex-start" padding={{ top: 'large' }}>
        <Button label="Add" onClick={() => dispatch({ type: 'add', value: 'Random value' })} />
        <Button type="ghost" color="error" label="Reset" onClick={() => dispatch({ type: 'reset' })} />
      </Row>
    </Row>
    <Row wrap="wrap" width="60%">
      { !toDos.length && <Text>No element added</Text> }
      { toDos.length > 0 && toDos.map((toDo, index) =>
        <Transition key={index} type={effect}>
          <Padding value="2px"><Button label={ toDo } /></Padding>
        </Transition>
      )}
    </Row>
  </Container>
</>
```
