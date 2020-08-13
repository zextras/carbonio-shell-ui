```jsx
import { useState } from 'react';
import {ThemeProvider, extendTheme, Button} from '@zextras/zapp-ui';
import Demo from './components/Demo'
const [dark, setDark] = useState(false);
<>
    <Demo dark={dark} setDark={setDark} />
</>

```
