
```jsx
import { Container, Padding, Text } from '@zextras/zapp-ui';
<>
    <Container orientation="horizontal" mainAlignment="flex-start" height={300}>
        <Container orientation="vertical" mainAlignment="space-around">
            <Text size="medium" color="text"> Sizes: small, medium, large </Text>
            <Icon icon="Activity" size="small"/>
            <Icon icon="Activity" size="medium"/>
            <Icon icon="Activity" size="large"/>
        </Container>
        <Container orientation="vertical" mainAlignment="space-around">
            <Text size="medium" color="text"> Color </Text>
            <Icon icon="Award" color="primary" size="medium"/>
            <Icon icon="Award" color="secondary" size="medium"/>
            <Container orientation="vertical" height="fit" width="fit" background="gray0">
                    <Icon icon="Award" color="gray6" size="medium"/>
            </Container>
            <Container orientation="vertical" height="fit" width="fit" background="gray0">
                <Icon icon="Award" color="warning" size="medium"/>
            </Container>
            <Icon icon="Award" color="text" size="medium"/>
            <Icon icon="Award" color="success" size="medium"/>
            <Icon icon="Award" color="error" size="medium"/>
        </Container>
    </Container>
</>
```
