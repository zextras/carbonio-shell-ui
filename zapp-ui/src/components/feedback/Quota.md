The quota element is used to display the user's quota usage percentage.

```jsx
import { Container, Padding } from '@zextras/zapp-ui';
<Container width="fill" background="gray5" crossAlignment="center">
    <Padding all="extrasmall">
        <Quota fill={10}/>
    </Padding>
    <Padding all="extrasmall">
        <Quota fill={25}/>
    </Padding>
    <Padding all="extrasmall">
        <Quota fill={50}/>
    </Padding>
    <Padding all="extrasmall">
        <Quota fill={75}/>
    </Padding>
    <Padding all="extrasmall">
        <Quota fill={90}/>
    </Padding>
    <Padding all="extrasmall">
        <Quota fill={100}/>
    </Padding>
</Container>
```
