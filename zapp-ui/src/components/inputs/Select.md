Select element maintains the same behavior of the [standard select element](https://www.w3.org/TR/2011/WD-html5-author-20110809/the-select-element.html).

His children will be built within the element, passing the options as `props`.
The dropdown menu and the items are rendered like [Dropdown](#/Components/Primitives/Dropdown)

```jsx
import { useState } from 'react';
import { Input, Text, Container, Icon } from '@zextras/zapp-ui';
const items = [
    {
        label: 'hi',
        value: '1'
    },
    {
        label: 'hello',
        value: '2'
    },
    {
        label: 'good day',
        value: '3'
    },
    {
        label: 'goodnight',
        value: '4'
    },
    {
        label: 'nothing',
        value: '5',
        disabled: true
    },
    {
        label: 'custom',
        value: '6',
        customComponent: <Container width="fit" mainAlignment="flex-start" orientation="horizontal"><Icon icon="People" color="primary"/><Text weight="bold">Special Greeting</Text></Container>
    }
];
const [selected, setSelected] = useState(4);
<>
    <Select
        items={items}
        background="gray5"
        label="Select an item"
        onChange={setSelected}
        defaultSelection={{ value: '4', label: 'goodnight' }}
    />
    <Text>Currently selected: {items[selected - 1].label}</Text>
</>
```

**Multiple selection**
```jsx
import {Input} from '@zextras/zapp-ui';
const items = [
    {
        label: 'hi',
        value: '1'
    },
    {
        label: 'hello',
        value: '2'
    },
    {
        label: 'good day',
        value: '3'
    },
    {
        label: 'goodnight',
        value: '4'
    }
];
<>
    <Select
        items={items}
        multiple={true}
        background="gray5"
        label="Select items"
        onChange={console.log}
    />
</>
```

**Custom Select Trigger**
```jsx
import { Container, Text, Row, Icon } from '@zextras/zapp-ui';
const LabelFactory = ({ selected, label, open, focus }) => {
  return (
    <Container
      orientation="horizontal"
      width="fill"
      crossAlignment="center"
      mainAlignment="space-between"
      borderRadius="half"
      padding={{
        vertical: 'small'
      }}
    >
      <Row takeAvailableSpace={true} mainAlignment="unset">
        <Text size="medium" color={open || focus ? 'primary' : 'secondary'}>{label}</Text>
      </Row>
      <Icon size="large" icon={open ? 'ChevronUpOutline' : 'ChevronDownOutline'} color={open || focus ? 'primary' : 'secondary'} style={{ alignSelf: 'center' }} />
    </Container>
  );
};

const items = [
    {
        label: 'hi',
        value: '1'
    },
    {
        label: 'hello',
        value: '2'
    },
    {
        label: 'good day',
        value: '3'
    },
    {
        label: 'goodnight',
        value: '4'
    }
];
<>
    <Select
        items={items}
        multiple={true}
        background="gray5"
        label="Type"
        onChange={console.log}
        LabelFactory={LabelFactory}
    />
</>
```