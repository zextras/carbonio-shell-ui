---
title: Service Worker
---

The [service worker][1] is a component which handle all the network tasks, running as separate process.

Each instance of the client on the same machine shares the same instance of the [service worker][1].
Moving the network activies and data management into the [service worker][1] will allow the clients to use the data coming from an one unique source of thuth.

The roles of the [service worker][1] are:
- Handle the `Sync` requests and responses to unify the [synchronization](#synchronization) process.
- Handle the folder structure and updates of the user's mailbox.

## Synchronization

[1]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
