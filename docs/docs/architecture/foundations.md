---
title: Foundations
---

The shell foundations relies on these principles:

- The shell handle the login process and data, this data is not exposed
  to the apps for security reasons.
- The shell handles the navigation and routing inside of the app.
- The shell handle the app loading and share with them some libraries in 
  order to minimize the apps bundles.
  - Some libraries can be proxed to acquire more controls and bind the app within its context.
- Apps MUST use the data storage system provided and managed by the shell, if a data storage is required by the App.

## Flavors
Zextras Shell is provided in some flavors.

To set the flavor set the `ZX_SHELL_FLAVOR` environment variable during the build phase.
```shell script
ZX_SHELL_FLAVOR=APP npm run build
```

### APP
This flavor is provided for the release of the deployed instance of Zextras Shell.

### NPM
This flavor is provided for the release of the [npm package][1] provided by the [Zapp CLI][2].

It is the same of the [app][3] flavor with some instruments for App develpment and Testing.

**Presets**:
- Mocked [`fetch`][5] calls
- User is logged in

## Code style
- Any component which handle any kind of data is written in Typescript.
- Any UI-related component can be written in pure Javascript.

[1]: https://www.npmjs.com/package/@zextras/zapp-shell
[2]: https://www.npmjs.com/package/@zextras/zapp-cli
[3]: #app
[5]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
