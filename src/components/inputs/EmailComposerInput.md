Input used in the Email Compose.

It can have the placeholder of two types:
+ **inline**: is in the same row of the text;
+ **default**: it goes above the text.

### Controlled EmailComposerInput

```jsx
import { useState, useRef } from 'react';

const [inputValue, setInputValue] = useState('');

<>
    <div>
        <EmailComposerInput placeholder="Object:" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <EmailComposerInput placeholder="Object:" placeholderType="inline" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
    </div>
</>
```

### Uncontrolled EmailComposerInput

```jsx
import { useState, useRef } from 'react';

<>
    <div>
        <EmailComposerInput placeholder="Object:" onChange={(e) => console.log("change", e.target.value)} />
        <EmailComposerInput placeholder="Object:" placeholderType="inline" onChange={(e) => console.log("change", e.target.value)} />
    </div>
</>
```
