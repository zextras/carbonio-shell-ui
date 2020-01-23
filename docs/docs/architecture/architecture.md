---
title: Technical Design
---

Zextras use a [micro frontends][1] approach to build a framework, agnostic on which application will be created on it.

## Fiber Channel
The fiber channel is shared [`Subject`][3] held by the Shell.

Each App will receive a special instance of the fiber channel where each event emitted is automatically populated with the
emitter data like the package name, version, etc. This type of fiber channel will automatically strip all events that not
belongs to the current App (if the `to` field is populated).

To send an event to a specific App or to keep the event inside the App, simply populate the `to` field of the event.

### Input Events
Input events are defined by the `IFCPartialEvent` type which require few parameters to be handled by the fiber channel, 
some data is added by the fiber channel itself.
```typescript
type IFCPartialEvent<T extends {} | string> = {
  to?: string; /* [Optional] The destination App's package name. */
  event: string;
  data: T;
}
```

### Output Events
Output events are defined by the `IFCEvent` type which is more complete than the input events. Some events may not reach all the Apps.
```typescript
type IFCEvent<T extends {} | string> = {
  to?: string; /* [Optional] The destination App's package name. */
  event: string;
  data: T;
  from: string; /* The emitting App's package name */
  version: string; /* The emitting App's package version */
}
```

## Operation Queue
Each operation performed by the Apps is managed by the Shell according to many factors.

### Workflow
1. A `sync:operation:push` event is emitted over the [fiber channel][2].
1. The `SyncService` will handle the event, adding the operation to shared stack stored into the Browser's [IndexedDB][4].
1. The `SyncService` will emit a [`execute_sync_operations`][5] event to inform the [ServiceWorker][6] to consume the operation list.
1. Once an operation is completed (or fails) from the [ServiceWorker][6] a `sync:operation:completed` (or `sync:operation:error`) 
   event is emitted over the [fiber channel][2].

[1]: https://martinfowler.com/articles/micro-frontends.html
[2]: #fiber-channel
[3]: https://rxjs-dev.firebaseapp.com/guide/subject
[4]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
[5]: architecture/service_worker.md#execute_sync_operations
[6]: architecture/service_worker.md
