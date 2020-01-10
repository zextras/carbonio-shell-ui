---
title: Data
author: Michele Olivo
---

## Folder

Field | Type | 🔑 | Notes
---|---|---|---
id | string | 🔑 ||
parent | string | 🔖 ||
name | string |||
unreadItemsCount | number |||
itemsCount | number |||

## Operation

Field | Type | 🔑 | Notes
---|---|---|---
opType | enum (`soap`) |||
opData | any || Data of the operation, the shell ignore this field, is used only by the apps in the operation response. |
request | OperationRequest |||
description | string |||

### SoapOpRequest extends OperationRequest

Field | Type | 🔑 | Notes
---|---|---|---
endpoint | string |||
urn | string |||
data | any |||

### OperationSchm

Field | Type | 🔑 | Notes
---|---|---|---
id | `autoincrement` | 🔑 ||
app | `package`: string | 🔖 on `package` ||
operation | Operation |||
