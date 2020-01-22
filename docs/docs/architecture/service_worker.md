---
title: Service Worker
---

The [service worker][1] is a component which handle all the network tasks, running as separate process.

Each instance of the client on the same machine shares the same instance of the [service worker][1].
Moving the network activities and data management into the [service worker][1] will allow the clients to use the data 
coming from an one unique source of truth.

The roles of the [service worker][1] are:
- Handle the `Sync` requests and responses to unify the [synchronization](#synchronization) process.
- Handle the folder structure and updates of the user's mailbox.

Each App can register a [service worker][1] to handle the notifications received from the Shell's [service worker][1].
The notifications received from the `Sync` response are shared using a [broadcast channel][2] named `com_zextras_zapp_shell_sw`;

## Synchronization

[1]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
[2]: https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel
