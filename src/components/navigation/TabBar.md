The TabBar is a customizable navigation component, which can be used for in-page navigation between different tabs.

### Uncontrolled Plain TabBar
```jsx
import {useState} from 'react';
import {Container, Divider, Text} from '@zextras/zapp-ui';
const items = [
  { id: 'tab-one', label: 'First Tab' },
  { id: 'tab-two', label: 'Second Tab' },
  { id: 'tab-three', label: 'Disabled', disabled: true }
];
const [change, setChange] = useState('');
const [click, setClick] = useState('');
<>
  <TabBar
    items={items}
    defaultSelected="tab-one"
    onChange={setChange}
    onItemClick={setClick}
    width={512}
    height={48}
  />
  <Container
    background="gray4"
    width={512}
    padding={{ all: 'small'}}
    crossAlignment="flex-start"
  >
    <Text style={{ fontFamily: 'monospace' }}>
      {`Change Event: '${change}'`}
    </Text>
    <Text style={{ fontFamily: 'monospace' }}>
      {`ClickEvent.selectedItemId: '${click.selectedItemId}'`}
    </Text>
  </Container>
</>
```
### Controlled Plain TabBar
```jsx
import {useState} from 'react';
import {Container, Divider, Text, Row, Button, Padding} from '@zextras/zapp-ui';
const items = [
  { id: 'tab-one', label: 'First Tab' },
  { id: 'tab-two', label: 'Second Tab' }
];
const [selected, setSelected] = useState('tab-one');
<>
  <TabBar
    items={items}
    selected={selected}
    onChange={console.log}
    onItemClick={(ev) => setSelected(ev.selectedItemId)}
    width={512}
    height={48}
  />
  <Container
    background="gray4"
    width={512}
    padding={{ all: 'small'}}
    crossAlignment="flex-start"
  >
    <Text size="large">
      {`Selected: '${selected}'`}
    </Text>
    <Text style={{ fontFamily: 'monospace' }}>
      {`ClickEvent.selectedItemId: '${selected}'`}
    </Text>
    <Row>
      {items.map(
        (item) => (
          <Padding
            key={item.id}
            all="small"
          >
            <Button
              label={`Select ${item.id}`}
              onClick={() => setSelected(item.id)}
            />
          </Padding>
        )
      )}
    </Row>
  </Container>
</>
```
### Customized TabBar
```jsx
import {useState} from 'react';
import {Container, Divider, Text, DefaultTabBarItem, Icon} from '@zextras/zapp-ui';
const CustomComponent = ({
    item,
    index,
    selected,
    onClick,
}) => (
  <Container onClick={onClick} width={'100%'} background={selected ? 'highlight' : 'gray4'}>
    <Text size="large" color={selected ? 'primary' : 'error'}>{item.label}</Text>
  </Container>
);
const ReusedDefaultTabBar = ({
    item,
    index,
    selected,
    onClick,
}) => (
  <DefaultTabBarItem
    item={item}
    index={index}
    selected={selected}
    onClick={onClick}
    orientation="horizontal"
  >
    <Icon size="large" icon={item.icon}/>
    <Text size="large">{item.label}</Text>
  </DefaultTabBarItem>
);
const items = [
  { id: 'tab-one', label: 'First Tab', CustomComponent },
  { id: 'tab-two', label: 'Second Tab', CustomComponent: ReusedDefaultTabBar, icon: 'BriefcaseOutline' },
  { id: 'tab-three', label: 'Another Tab', CustomComponent },
  { id: 'tab-four', label: 'Car Tab', CustomComponent: ReusedDefaultTabBar, icon: 'CarOutline' }
];
const [change, setChange] = useState('');
const [click, setClick] = useState('');
<>
  <TabBar
    items={items}
    defaultSelected="tab-one"
    onChange={setChange}
    onItemClick={setClick}
    width={512}
    height={48}
  />
  <Container
    background="gray4"
    width={512}
    padding={{ all: 'small'}}
    crossAlignment="flex-start"
  >
    <Text style={{ fontFamily: 'monospace' }}>
      {`Change Event: '${change}'`}
    </Text>
    <Text style={{ fontFamily: 'monospace' }}>
      {`ClickEvent.selectedItemId: '${click.selectedItemId}'`}
    </Text>
  </Container>
</>
```
### Mixed TabBar
```jsx
import {useState} from 'react';
import {Container, Divider, Text, Icon} from '@zextras/zapp-ui';
const CustomComponent = ({
    item,
    index,
    selected,
    onClick,
}) => (
  <Container onClick={onClick} width="100%" height={50} background={selected ? 'highlight' : 'gray4'}>
    <Text size="large" color={selected ? 'primary' : 'error'}>{item.label}</Text>
    {item.specialProp && (<Text size="large" color={selected ? 'primary' : 'text'}>{item.specialProp}</Text>)}
    {item.icon && (<Icon icon={item.icon} size="large" color={selected ? 'primary' : 'info'}/>)}
  </Container>
);
const items = [
  { id: 'one', label: 'Hello' },
  { id: 'two', label: 'Hello' },
  { id: 'three', label: 'Hello', CustomComponent, specialProp: 'World' },
  { id: 'four', label: 'Hello', CustomComponent, icon: 'SmilingFaceOutline' },
  { id: 'five', label: 'Hello', disabled: true }
];
const [change, setChange] = useState('');
const [click, setClick] = useState('');
<>
  <TabBar
    items={items}
    defaultSelected="tab-one"
    onChange={setChange}
    onItemClick={setClick}
    width={512}
    height={48}
    underlineColor="success"
  />
  <Container
    background="gray4"
    width={512}
    padding={{ all: 'small'}}
    crossAlignment="flex-start"
  >
    <Text style={{ fontFamily: 'monospace' }}>
      {`Change Event: '${change}'`}
    </Text>
    <Text style={{ fontFamily: 'monospace' }}>
      {`ClickEvent.selectedItemId: '${click.selectedItemId}'`}
    </Text>
  </Container>
</>
```
