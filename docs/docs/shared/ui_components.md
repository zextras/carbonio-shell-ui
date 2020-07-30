---
title: Shared UI Components
---

Zextras Shell allow Apps to share UI Components and using them to improve Apps integrations.

An app can register any Component as it needs.

## Use a shared UI Component
Any UI component can render shared UI Components. These components are created by a Factory exposed to the App Codebase.

The `SharedUiComponentsFactory` will render *the list* of the components registered for the requested scope.

Any property passed to the factory will be passed down to the component.

```jsx
import React from 'react';
import { ui } from '@zextras/zapp-shell';

const SharedUiComponentsFactory = ui.SharedUiComponentsFactory;

function MyComponent() {
  return (
      <>
          <div>
            I am using shared components!
          </div>
          <SharedUiComponentsFactory 
            scope="interesting-scope"
            customProp="My custom PROP value"
          />
      </>
  );
}
```

## Share a UI Component
A Component can see only the App Context its belongs to. Hooks related to the App Context can be used.

Components must define its `propTypes` or the `addSharedUiComponent` will throw an error.

As the Components registered are not requested to be suspended is heavily suggested to [suspend][1] the components to improve
system performances. 

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
MySharedComponent.propTypes = {
  customProp: PropTypes.string.isRequired
};

export default function app() {
  setAppContext({
    contextValue: 'A value from the App Context'
  });

  addSharedUiComponent(
    'interesting-scope',
    MySharedComponent
  );
}
```

[1]: https://it.reactjs.org/docs/concurrent-mode-suspense.html
