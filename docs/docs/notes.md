---
title: Notes
author: Michele Olivo
---

If You need to develop on the shell while You are developing on another app, You can build the Shell and replace the content of the `node_modules/@zextras/zapp-shell/` folder.

To achieve this result You can simply run this command:
```shell script
PKG_PATH=<YOUR PACKAGE PATH HERE> \
  && npm run prepublishOnly \
  && rm -rf $PKG_PATH/node_modules/@zextras/zapp-shell/build/ \
  && cp -r build/ $PKG_PATH/node_modules/@zextras/zapp-shell/ \
  && rm -rf $PKG_PATH/node_modules/@zextras/zapp-shell/lib/ \
  && cp -r lib/ $PKG_PATH/node_modules/@zextras/zapp-shell/ \
  && rm -rf lib/
```
