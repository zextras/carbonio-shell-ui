### Counter Badge

```jsx
import { Text, ContactListItem } from '@zextras/zapp-ui';

<>
    <p><Badge value="1" /></p>
    <p><Badge value={10} type="unread" /></p>
    <p><Badge value={100} type="unread" /></p>
</>
```

### Label Badge

```jsx
import { Text, ContactListItem } from '@zextras/zapp-ui';

<>
    <p><Badge value="Sent" /></p>
    <p><Badge value="Sent" type="unread" /></p>
    <p><Text overflow="break-word">Lorem ipsum dolor sit <Badge value="amet" type="unread" /></Text></p>
</>
```