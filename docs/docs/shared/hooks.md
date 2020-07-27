---
title: Hooks
---

The Shell shares some hooks as utility for the React components.

## useObserveDb
```typescript
function useObserveDb(query: () => Promise<any>, db: Database): any {}
```

Observe a database running the query on each change.

## useAppPkg
```typescript
function useAppPkg(): AppPkgDescription {}
```

Returns the App Package from the current App context.

## useAppContext
```typescript
function useAppContext(): any {}
```
Return the object set with the [`setAppContext()`][1] function enhanced with the App Package data.

## useAddBoardCallback
```typescript
function useAddBoardCallback(path: string): () => void {}
```

Create a callback to add a board set on the provided path.

## usePushHistoryCallback
```typescript
function usePushHistoryCallback(): (location: LocationDescriptor) => void {}
```

Create a callback to push a location into the history.

## useGoBackHistoryCallback
```typescript
function useGoBackHistoryCallback(): () => void {}
```

Create a callback to return back by 1 location from the history.

## useReplaceHistoryCallback
```typescript
function useReplaceHistoryCallback(): (location: LocationDescriptor) => void {}
```

Create a callback to replace the current path with the provided one.

## useBehaviorSubject
```typescript
function useBehaviorSubject<T>(observable: BehaviorSubject<T>): T {}
```

Observe a [BehaviorSubject][2] optimizing the renders.

[1]: zapp_shell.md#setappcontext
[2]: https://rxjs-dev.firebaseapp.com/api/index/class/BehaviorSubject
