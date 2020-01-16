---
title: APPs
---

Apps for [@zextras/zapp-shell][1] will be created using the [@zextras/zapp-sdk][2] tool.
For more information on how to create a Zextras Apps please refer to the [@zextras/zapp-sdk][2] documentation.

## `@zextras/route`
Functions related to the route.

- `registerRoute(path, componentClass, defaultProps)`: Register a component class for a router with some default props.
    `defaultProps` will be passed to the component class at the render time. The component will be rendered only when
    the route will be hit.
- `addMainMenuItem(icon, label, path)`: Register a main menu item with an icon (as React Element), a label and the route
    where the user will be redirected clicking on the item.

## `@zextras/network`
Functions related to the network.

- `registerNotificationParser()`: Register a [notification parser](dev/notifications/notifications_parsers).
- `async sendSOAPRequest(command, data, urn?)`: Send a [SOAP request](dev/network/soap)

## Shimmed dependencies
Shimmed dependencies mapped and exposed as `__ZAPP_SHARED_LIBRARIES__` constant inside the window.
- `clsx` (1.0.4) from the package [clsx](https://github.com/lukeed/clsx)
- `react` (16.9.0) from the package [react](https://github.com/facebook/react)
- `@material-ui/core` (4.5.2) from the package [@material-ui/core][3]
- `@material-ui/icons` (4.5.1) from the package [@material-ui/icons][3]
- `idb` (4.0.5) from the package [idb](https://github.com/jakearchibald/idb)
- `lodash` (4.17.15) from the package [lodash](https://github.com/lodash/lodash)
- `rxjs` (6.5.3) from the package [rxjs](https://github.com/reactivex/rxjs)
    - `rxjs/operators`

[1]: https://bitbucket.org/zextras/iris-shell
[2]: https://bitbucket.org/zextras/iris-cli
[3]: https://github.com/mui-org/material-ui
