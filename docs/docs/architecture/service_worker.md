---
title: Service Worker
---

The [service worker][1] is a component which handle all the network and synchronization tasks, running as separate process.

The [service worker][1] is controlled by the Shell through the `ServiceWorkerService`.

Each instance of the client on the same machine shares the same instance of the [service worker][1].
Moving the network activities and data management into the [service worker][1] will allow the clients to use the data 
coming from an one unique source of truth.

The roles of the [service worker][1] are:
- Handle the `Sync` requests and responses to unify the [synchronization](#soap_sync) process.

Each App can register a [service worker][1] to handle the notifications received from the Shell's [service worker][1].
The notifications received from the `Sync` response are shared using a [broadcast channel][2] named `com_zextras_zapp_shell_sw`;

## Commands

### `soap_sync`
Perform a sync request and propagate the notifications to all Apps.

The sync is defined in these steps:

1. Load [SyncData][3]
1. Send a [`SyncRequest`][4] with the [sync token][5]
    - If no [SyncData][3] is stored, perform also a [`GetInfoRequest`][6] to retrieve the account id
1. Store the updated [sync token][5] into the [SyncData][3]
1. Send a [`SOAP:notification:handle`](#soapnotificationhandle) message over the [broadcast channel][2]

### `execute_sync_operations`
Try to consume the operation queue.
1. Load the operations stack from the [IndexedDB][10].
1. Perform all the request as described inside the [operation data][11].
1. For each result, if the request:
    - **Success**: Emit a [`sync:operation:completed`][12] event over the [broadcast channel][2]
    - **Fail**: Emit a [`sync:operation:error`][13] event over the [broadcast channel][2]

For more information on how the Operation Queue is consumed, please refer to the [Operation Queue page][9].

## Broadcast Channel
Shell's [service worker][1] and [Apps' service worker][7] can communicate only using a dedicated 
[broadcast channel][2] named `com_zextras_zapp_shell_sw`.

The [broadcast channel][2] is also shared with the `ServiceWorkerService` to allow the service worker to communicate with
his service.

All messages will have this format:
```typescript
type BroadcastChannelMessage = {
  action: string;
  data: any;
};
```

Action can be one of:

### `SOAP:notification:handle`
This event is **emitted** to request the Apps to handle incoming notification from the SOAP engine.

The **data** field contains the complete [SyncResponse][8] Object without the [sync token][5] (for security reasons). 

### `sync:operation:complete`
This event is **emitted** to notify to the Apps about the completion of an operation.

### `sync:operation:error`
This event is **emitted** to notify to the Apps about the error of the management of an operation.

[1]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
[2]: https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel
[3]: architecture/data.md#sync
[4]: https://files.zimbra.com/docs/soap_api/8.8.8/api-reference/zimbraMail/Sync.html
[5]: https://files.zimbra.com/docs/soap_api/8.8.8/api-reference/zimbraMail/Sync.html#tbl-SyncRequest-token
[6]: https://files.zimbra.com/docs/soap_api/8.8.8/api-reference/zimbraAccount/GetInfo.html
[7]: architecture/apps.md#service-worker
[8]: https://files.zimbra.com/docs/soap_api/8.8.8/api-reference/zimbraMail/Sync.html
[9]: architecture/architecture.md#operation-queue
[10]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
[11]: architecture/data.md#operation
[12]: #syncoperationcomplete
[13]: #syncoperationerror
