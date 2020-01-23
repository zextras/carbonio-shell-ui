---
title: Data
---

This page describes the data structures stored into the Browser's [IndexedDB][1] and used across the Shell.

## Sync
| Field | Type | 🔑 | Notes |
|-------|------|---|-------|
| accountId | string | 🔑 ||
| token | number |||
| modifyDate | number |||

## Folder

| Field | Type |   | Notes |
|-------|------|---|-------|
| id | string |||
| parent | string |||
| name | string |||
| unreadItemsCount | number |||
| itemsCount | number |||

## Operation

| Field | Type |  🔑 | Notes |
|-------|------|---|-------|
| opType | enum (`soap`) |||
| opData | any || Data of the operation, the shell ignore this field, is used only by the apps in the operation response. |
| request | OperationRequest |||
| description | string |||

### SoapOpRequest extends OperationRequest

| Field | Type | 🔑  | Notes |
|-------|------|---|-------|
| endpoint | string |||
| urn | string |||
| data | any |||

### OperationSchm

| Field | Type | 🔑  | Notes |
|-------|------|---|-------|
| id | `autoincrement` |||
| app | `package`: string | 🔖 on `package` ||
| operation | Operation |||

[1]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
