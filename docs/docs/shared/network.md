---
title: Network
---

Shell exposes some network utilities to make easier network calls.

Shared network utils can be used with the import:
```typescript
import { network } from '@zextras/zapp-shell';
```

## API
### soapFetch
```typescript
function soapFetch<REQ, RESP>(api: string, body: REQ & SoapRequest): Promise<RESP> {}
```

Utility to make a SOAP request, authentication is handled by the shell.
Input and output are objects, no encoding/decoding is required.

Parameters:
- `api`: The name of the [Zimbra SOAP API][0], without the `Request` suffix.
- `body`: The content of the request.

Returns:
A Promise which will resolve with the API response or rejects with the error response.

[0]: https://wiki.zimbra.com/wiki/SOAP_API_Reference_Material_Beginning_with_ZCS_8
