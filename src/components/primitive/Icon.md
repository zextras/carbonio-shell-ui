
```jsx
import { Container, Padding, Text } from '@zextras/zapp-ui';
<>
    <Container orientation="horizontal" mainAlignment="flex-start" height={300}>
        <Container orientation="vertical" mainAlignment="space-around">
            <Text size="medium" color="txt_1"> Sizes: small, medium, large </Text>
            <Icon icon="Activity" size="small"/>
            <Icon icon="Activity" size="medium"/>
            <Icon icon="Activity" size="large"/>
        </Container>
        <Container orientation="vertical" mainAlignment="space-around">
            <Text size="medium" color="txt_1"> Color </Text>
            <Icon icon="Award" color="txt_2" size="medium"/>
            <Icon icon="Award" color="txt_4" size="medium"/>
            <Container orientation="vertical" height="fit" width="fit" background="bg_6">
                    <Icon icon="Award" color="txt_3" size="medium"/>
            </Container>
            <Container orientation="vertical" height="fit" width="fit" background="bg_6">
                <Icon icon="Award" color="txt_7" size="medium"/>
            </Container>
            <Icon icon="Award" color="txt_1" size="medium"/>
            <Icon icon="Award" color="txt_6" size="medium"/>
            <Icon icon="Award" color="txt_5" size="medium"/>
        </Container>
    </Container>
</>
```
