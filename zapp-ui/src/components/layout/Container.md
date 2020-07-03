The container is a layout element that is used to create compositions.

### Orientation

```jsx
import { Padding, Text, Icon, IconData } from '@zextras/zapp-ui';
<Container padding={{ all: 'small'}} orientation="vertical">
    <Text size="large">
        Vertical Orientation
    </Text>
    <Container background="gray5" orientation="vertical">
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>   
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
    <Text size="large">
        Horizontal Orientation
    </Text>
    <Container background="gray5" orientation="horizontal">
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
</Container>
```

### Width/Height

```jsx
import { Padding, Text, Icon, IconData } from '@zextras/zapp-ui';
<Container padding={{ all: 'small'}} orientation="vertical">
    <Text size="large">
        Fill Container
    </Text>
    <Container background="gray5" width="fill" height="fill">
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>   
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
    <Text size="large">
        Fit Content
    </Text>
<Container background="gray5" width="fit" height="fit">
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
    <Text size="large">
        Fixed Dimensions (string)
    </Text>
    <Container background="gray5" width="20vw" height="20vh">
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
    <Text size="large">
        Fixed Dimensions (number)
    </Text>
    <Container background="gray5" width={400} height={200}>
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
</Container>
```

### Background

```jsx
import { Padding, Text, Icon, IconData } from '@zextras/zapp-ui';
<Container padding={{ all: 'small'}} orientation="vertical">
    <Container background="primary">
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>   
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
    <Container background="gray1">
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
    <Container background="gray0">
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
    <Container background="gray5">
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
</Container>
```

### Border Radius

```jsx
import { Padding, Text, Icon, IconData } from '@zextras/zapp-ui';
<Container padding={{ all: 'small'}} orientation="vertical">
    <Text size="large">
        Regular
    </Text>
    <Container width={100} height={100} borderRadius="regular" background="gray0">
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>   
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
    <Text size="large">
        Half
    </Text>
    <Container width={100} height={100} borderRadius="half" background="gray0">
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>   
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
    <Text size="large">
        Round
    </Text>
    <Container width={120} height={120} borderRadius="round" background="gray0">
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>   
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
</Container>
```

### Alignment

```jsx
import { Container, Text, Icon, IconData } from '@zextras/zapp-ui';
<Container padding={{ all: 'small'}} orientation="vertical">
    <Text size="large">
        Center
    </Text>
    <Container background="gray5" width={200} height={200} mainAlignment="center" crossAlignment="center">
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>   
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
    <Text size="large">
        Start
    </Text>
    <Container background="gray5" width={200} height={200} mainAlignment="flex-start" crossAlignment="flex-start">
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>   
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
    <Text size="large">
        Space Between / Center
    </Text>
    <Container background="gray5" width={200} height={200} mainAlignment="space-between" crossAlignment="flex-end">
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>   
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
</Container>
```
### Padding

```jsx
import { Container, Text, Icon, IconData } from '@zextras/zapp-ui';
<Container padding={{ all: 'small'}} orientation="vertical">
    <Text size="large">
        Small
    </Text>
    <Container background="gray5" width="fit" height="fit" padding={{ all: 'small' }}>
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>   
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
    <Text size="large">
        Large
    </Text>
    <Container background="gray5" width="fit" height="fit" padding={{ all: 'large' }}>
        <div style={{ background: 'lightblue', width: '24px', height: '24px' }}/>   
        <div style={{ background: 'darkblue', width: '24px', height: '24px' }}/>
        <Icon icon="Activity" size="large"/>
        <div style={{ background: 'blue', width: '24px', height: '24px' }}/>
    </Container>
</Container>
```
