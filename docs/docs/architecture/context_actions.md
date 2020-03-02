---
title: Context Actions
---

The shell will collect and provide the actions which can be performed on a item (or a group of items) based on a context.

## Basic principles
The entire Item Action system is built with around this workflow:
1. An action context (is basically a string) is WHERE an action can be performed.
1. An action can be performed on an item or a group of items.
1. Any app can register many actions on many context.
1. Any view can retrieve a list of actions for the declared items, the view will manage how to render that actions.

## Action Registration
The actions are registered by the Apps using the utility functions exposed by the package `@zextras/zapp-shell/itemActions`:
```typescript
declare module '@zextras/zapp-shell/itemActions' {
  function registerItemAction(action: AppItemAction): void;
}
```
Where the `action` is defined by the interface:
```typescript
type AppItemAction = {
	/** The name of the action, must be unique inside an App */ name: string;
	/** The icon of the action */ icon: ReactElement;
	/** The icon of the action */ label: string;
	/** The callback invoked on an item */ onActivate: (item: any) => void;
	/** @optional Function to check if the action can be applied to the item(s) */ onCheck?: (item: any) => Promise<boolean>;
};
```
The shell will spread the action across the whole system, any App can consume the action.

## Action Consuming
The actions can consumed by the react elements using the utility hook `useItemActionContext` (see [hooks page][1] for more information).

The actions returned by the hook are ready to be consumed as the functions are wrapped around the items declared to the hook.

[1]: utility/hooks.md#useitemactioncontext
