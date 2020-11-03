---
title: Hooks
---

The Shell shares some hooks as utility for the React components.

Shared hooks can be used with the import:
```typescript
import { hooks } from '@zextras/zapp-shell';
```

## useAddBoardCallback
```typescript
function useAddBoardCallback(path: string): () => void {}
```

Create a callback to add a board set on the provided path.

## useAppContext
```typescript
function useAppContext(): any {}
```
Return the object set with the [`setAppContext()`][1] function enhanced with the App Package data.

## useAppPkg
```typescript
function useAppPkg(): AppPkgDescription {}
```

Returns the App Package from the current App context.

## useBehaviorSubject
```typescript
function useBehaviorSubject<T>(observable: BehaviorSubject<T>): T {}
```

Observe a [BehaviorSubject][2] optimizing the renders.

## useFiberChannel

## useGoBackHistoryCallback
```typescript
function useGoBackHistoryCallback(): () => void {}
```

Create a callback to return back by 1 location from the history.

## useObserveDb
```typescript
function useObserveDb(query: () => Promise<any>, db: Database): any {}
```

Observe a database running the query on each change.

## usePromise

## usePushHistoryCallback
```typescript
function usePushHistoryCallback(): (location: LocationDescriptor) => void {}
```

Create a callback to push a location into the history.

## useRemoveCurrentBoard

## useReplaceHistoryCallback
```typescript
function useReplaceHistoryCallback(): (location: LocationDescriptor) => void {}
```

Create a callback to replace the current path with the provided one.

## useTranslation

## useUserAccounts

[1]: zapp_shell.md#setappcontext
[2]: https://rxjs-dev.firebaseapp.com/api/index/class/BehaviorSubject
