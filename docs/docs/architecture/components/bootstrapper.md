---
title: bootstrapper
---

The role of the bootstrapper is to initialize the components needed by the
context provided by the bootstrapper to the whole application.

The components initialized are:
- [Shell DB][1]
- [Shell Network Service][2]

Once these components are initialized the [Boostrapper Router][3] is rendered.

## Bootstrapper Router

The role of the bootstrapper router is to initialize a [BrowserRouter][4] and handle
the routing between the `/`, `/login` and `/logout` paths.

The components associated to each route is lazy loaded.

A particular route is the main (`/`) route, which renders the [Shell View][5]

## Bootstrapper Context
A context is initialized by the bootstrapper, this context held:
- [Shell DB][1]
- [Shell Network Service][2]
- The [Account][6]s Loaded
  - A boolean to indicate if the accounts are loaded or not

[1]: architecture/components/shell_db.md
[2]: architecture/components/shell_network_service.md
[3]: #bootstrapper-router
[4]: https://reacttraining.com/react-router/web/api/BrowserRouter
[5]: architecture/components/shell_view.md
[6]: architecture/classes/account.md
