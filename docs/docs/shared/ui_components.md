---
title: Shared UI Components
---

Zextras Shell allows Apps to share UI Components and use them to improve Apps integrations.

An app can register any Component as it needs.

## Use a shared UI Component
Any UI component can render shared UI Components. These components are retrieved by the `useSharedCompontent` hook.

```jsx
import React from 'react';
import { ui } from '@zextras/zapp-shell';

function MyComponent() {
  const ComponentFromAnotherApp = useSharedComponent('component_id', '1');
  return (
      <>
          <div>
            I am using shared components!
          </div>
          <ComponentFromAnotherApp 
            customProp="My custom PROP value"
          />
      </>
  );
}
```

## Share a UI Component
A Component can see only the App Context its belongs to. Hooks related to the App Context can be used.


```jsx
import React from 'react';
import PropTypes from 'prop-types';
import { addSharedUiComponent, setAppContext, useAppContext } from '@zextras/zapp-shell';

function MySharedComponent({ customProp }) {
  const { contextValue } = useAppContext();
  
  return (
    <div>
      <span>My Shared Component</span>
      { contextValue }
      { customProp }
    </div>
  );
}

export default function app() {
  // ...
	useEffect(() => {
		registerSharedUiComponents({
			test_component: {
				versions: {
					1: MySharedComponent
				}
			}
		});
  }, []);
  // ...
}
```

[1]: https://it.reactjs.org/docs/concurrent-mode-suspense.html
