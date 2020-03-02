---
title: Hooks (for React)
---

For convenience there are some [hooks][1] exposed by the shell which can be used inside any App.

## useItemActionContext
#### Signature
```typescript
declare function useItemActionContext(context: string, item: any): WrappedItemAction[];
```
#### Usage
This hook will return the actions for a specified item (or group of items) in a specific context.

The functions inside the actions are wrapped around the provided items, so no parameters are required by those functions.

[1]: https://reactjs.org/docs/hooks-intro.html
