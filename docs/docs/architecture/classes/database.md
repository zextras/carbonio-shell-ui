---
title: Database
---

The Database class extends the [Dexie][1]'s own class and enhance the [Dexie][1] store
with some utilities and methods.

By default any Database will be enhanced with the [Dexie Observable][2] and [Dexie Syncable][3]
plugins.

## API
For a complete reference please take a look to the [Dexie][1]'s documentation.
In this document will be listed only the added methods.

### registerSyncProtocol
```typescript
function registerSyncProtocol(name: string, protocol: ISyncProtocol): void {}
```
Register a [sync protocol][4].

### observe
```typescript
function observe(comparator: () => Promise<any>): Subject<any> {}
```
Create an [Observable][5] starting from a Query.
When the database is notified for a change the query is performed and the result
is emitted on the observable.

A result is also emitted when the function is invoked.

**Attention** This function is not yet optimized, the query will be executed on **any**
change on the database.

[1]: https://dexie.org
[2]: https://dexie.org/docs/Observable/Dexie.Observable
[3]: https://dexie.org/docs/Syncable/Dexie.Syncable.js
[4]: https://dexie.org/docs/Syncable/Dexie.Syncable.ISyncProtocol
[5]: https://rxjs-dev.firebaseapp.com/api/index/class/Observable
