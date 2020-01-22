---
title: APPs
---

Apps for [@zextras/zapp-shell][1] will be created using the [@zextras/zapp-sdk][2] tool.
For more information on how to create a Zextras Apps please refer to the [@zextras/zapp-sdk][2] documentation.

## Service Worker
Apps can register a [service worker][4] to handle notifications and/or perform background operations.

The service worker of an App can communicate with the [Shell's service worker][3] using a [broadcast channel][6].

For a complete reference please refer to the dedicated [Service Worker page][3].

[1]: https://bitbucket.org/zextras/iris-shell
[2]: https://bitbucket.org/zextras/iris-cli
[3]: architecture/service_worker.md
[4]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
[5]: https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel
[6]: architecture/service_worker.md#broadcast-channel
