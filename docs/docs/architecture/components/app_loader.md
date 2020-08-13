---
title: App Loader
---

The role of the App Loader is to load the Apps enabled for the current account sharing with them some packages in order
to reduce the App bundle size and add coherency to the system.

The App loader loads all the Apps asynchronously using a hidden iframe.
The code of the apps runs into the iframe where the codebase is loaded.

For each App a context is created and each API provided by the Shell is bound to that context.

For more information about the shared packages please refer to the [Shared packages page][2]

## App Loader Context
The App Loader Context listen for changes on the [Account][1] data and load/unload apps as needed.

This context exposes the cache of the contexts of the loaded Apps.

[1]: architecture/classes/account.md
[2]: shared/shared_packages.md
