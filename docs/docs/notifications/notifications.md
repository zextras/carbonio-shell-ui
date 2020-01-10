---
title: Notifications
author: Michele Olivo
---

Notifications are wrapped inside the `Head` of each response made using the [SOAP channel][1].

The shell itself does not parse any notification as it does not register any parser, the parsing is demanded to each App.
Each App can provide a set of [notification parsers][2].

[1]: dev/network/soap
[2]: dev/notifications/notifications_parsers
