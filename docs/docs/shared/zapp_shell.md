---
title: @zextras/zapp-shell
---

`@zextras/zapp-shell` is the package for the methods exposed by the Shell to the Apps. This package is handled by the
`zapp-cli` and is injected by the Shell at runtime.

The method exposed to the Apps are confined to the app context for securilty reasons.

## Usage
To use a method or a class exposed by the package, simply import it as any package.

```javascript
import { setCreateOptions } from '@zextras/zapp-shell';
```

## API
### setMainMenuItems(items: MainMenuItemData[]): void
Set the main menu item data object replacing the previous data, his children are rendered inside the
component formerly known as *[Secondary bar][1]*.

```typescript
type MainMenuItemData = {
	id: string;
	icon: string;
	label: string;
	to: string;
	children?: Array<MainSubMenuItemData>;
	app: string;
};

type MainSubMenuItemData = {
	id: string;
	icon?: string;
	label: string;
	to: string;
	children?: Array<MainSubMenuItemData>;
};
``` 

### setRoutes
```typescript
function setRoutes(routes: AppRouteDescription[]): void {}
```
Set the routes handled by the App replacing the previous data.

Routes MUST render a [lazy components][2] to reduce the main App bundle and improve the system load.

```typescript
import { LazyExoticComponent } from 'react';

type AppRouteDescription = {
	route: string;
	view: LazyExoticComponent<any>;
	label: LazyExoticComponent<any>;
};
```

### setCreateOptions
```typescript
function setCreateOptions(options: AppCreateOption[]): void {}
```
Set the options shown to *Create* things replacing the previous data. 

Usually these options are related to the *Create* button shown in the [header of the shell][3].

Only one option between `onClick` and `panel` is required.
- `onClick`: Callback invoked when the option is selected
- `panel.path`: When the options is seleted the `path` is opened as [panel][4]

```typescript
type AppCreateOption = {
	id: string;
	onClick?: () => void;
	panel?: {
		path: string;
	};
	label: string;
};
```

### setAppContext
```typescript
function setAppContext(obj: any): void {}
```
Set an object that will be passed to any component of the App using the `AppContext`.

Any component of an App can use the [`useAppContext()`][5] hook to retrieve the object.

[1]: architecture/components/secondary_bar.md
[2]: https://reactjs.org/docs/react-api.html#reactlazy
[3]: architecture/components/shell_view.md#shell-header
[4]: architecture/components/app_panel_window.md#panel-container
[5]: hooks.md#useappcontext
