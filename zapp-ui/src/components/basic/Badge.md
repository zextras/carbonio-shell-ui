### Counter Badge

```jsx
<>
    <Badge value="1" />
    <br/>
    <Badge value={10} type="unread" />
    <br/>
    <Badge value={100} type="unread" />
</>
```

### Label Badge
```jsx
import { Text, ContactListItem } from '@zextras/zapp-ui';
<>
    <Badge value="Sent" />
    <br/>
    <Badge value="Sent" type="unread" />
    <br/>
    <Text overflow="break-word">Lorem ipsum dolor sit <Badge value="amet" type="unread" /></Text>
</>
```
