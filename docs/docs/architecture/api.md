---
title: API
---

## FiberChannel Events

📫 | Int | Event Name | Data | Notes
:-:|:---:|:----------:|------|------
📤 || `notification:item:deleted` | `id`: string ||
📤 || `app:all-loaded` |||
📤 || `app:preload` | `package`: string ||
📤 || `app:loaded` | `package`: string <br> `version`: string ||
📤 || `app:load-error` | `package`: string <br> `version`: string <br> `error`: Error ||
📤 || `app:preunload` | `package`: string ||
📤 || `app:unloaded` | `package`: string ||
📤 || `sync:completed` |||
📤 || `sync:completed:folder` | `id`: string ||
📥 || `sync:operation:push` | `operation`: Operation ||
📥 || `sync:operation:cancel` | string: the Operation `id` ||
📤 || `sync:operation:completed` | `operation`: Operation <br> `result`: any | The result depends on the type of the operation |
📤 || `sync:operation:error` | `operation`: Operation <br> `error`: Error ||

Folders are managed by Zimbra as container for Items, we want to change this behavior because any “App“  can handle its folders. The shell will provide only types and utilities shared across the apps but no handling is performed by the shell itself.
