---
title: Shell Network Service
---

The network service is a component with the role to make calls to the server and
return to the components the responses as Promise.

The network service is initialized by the [bootstrapper][3] and propagated by the
[bootstrapper context][4].

Part of the error management is handled by this component.

Some responses are normalized to be used within the application.

## API
### getAccountInfo
```typescript
function getAccountInfo(): Promise<GetInfoResponse> {}
```
Get the current account info.

**Returns**: [GetAccountInfoResponse Object][1]

### doLogin
```typescript
function doLogin(username: string, password: string): Promise<Account> {}
```
Performs the login. Once the user is authenticated a `getAccountInfo()` is performed to
retrieve the whole account info.

**Returns**: [Account][2]

### doLogout
```typescript
function doLogout(): Promise<void> {}
```
Performs the logout from the current session.

**Returns**: *void*

[1]: https://files.zimbra.com/docs/soap_api/8.8.15/api-reference/zimbraAccount/GetAccountInfo.html
[2]: architecture/classes/account.md
[3]: architecture/components/bootstrapper.md
[4]: architecture/components/bootstrapper.md#bootstrapper-context
